from ultralytics import YOLO
import cv2
import numpy as np
import time
from datetime import datetime
from pymongo import MongoClient
from twilio.rest import Client
import cloudinary
import cloudinary.uploader
import pygame
import os
from facenet_pytorch import MTCNN
from PIL import Image
import torch
from dotenv import load_dotenv

# --- Load environment variables from root directory ---
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# --- Twilio Configuration ---
account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
twilio_client = Client(account_sid, auth_token)

def send_whatsapp_message_with_image(image_url, message_text):
    try:
        message = twilio_client.messages.create(
            body=message_text,
            from_=os.environ.get("TWILIO_WHATSAPP_FROM"),
            to=os.environ.get("TWILIO_WHATSAPP_TO"),
            media_url=[image_url]
        )
        print(f"[✅ WhatsApp Sent] {message.sid}")
    except Exception as e:
        print(f"[❌ WhatsApp Error] {e}")

# --- Cloudinary Configuration ---
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

# --- MongoDB Configuration ---
mongo_client = MongoClient(os.environ.get("MONGO_URI"))
db = mongo_client["traffic_violation"]
collection = db["violations"]

# --- Sound Setup ---
pygame.mixer.init()
alert_playing = False

def start_alert_sound():
    global alert_playing
    if not alert_playing:
        # Assuming alert.mp3.wav is in the scripts folder or root
        sound_path = os.path.join(os.path.dirname(__file__), "alert.mp3.wav")
        if os.path.exists(sound_path):
            pygame.mixer.music.load(sound_path)
            pygame.mixer.music.play(-1)
            alert_playing = True
        else:
            print(f"[⚠️ Warning] Sound file not found at {sound_path}")

def stop_alert_sound():
    global alert_playing
    if alert_playing:
        pygame.mixer.music.stop()
        alert_playing = False

# --- YOLO Models ---
# 1. COCO model for motorcycle detection (class=3)
coco_model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'yolov8s.pt')
yolo_coco = YOLO(coco_model_path)

# 2. Custom model for violation detection
model_path_env = os.environ.get("MODEL_PATH", "models/best.pt")
if not os.path.isabs(model_path_env):
    model_path = os.path.join(os.path.dirname(__file__), '..', model_path_env)
else:
    model_path = model_path_env

model_main = YOLO(model_path)

class_names = [
    "fire", "no plate", "phone usage", "smoking",
    "stunt riding", "triples", "with helmet", "without helmet"
]

severity_map = {
    "without helmet": "high",
    "phone usage": "high",
    "triples": "high",
    "smoking": "high",
    "no plate": "high",
    "with helmet": "medium",
    "stunt riding": "low"
}

violation_map = {
    "phone usage": "phoneUsage",
    "no helmet": "noHelmet",
    "triple riding": "tripling",
    "wrong way": "wrongway",
    "fire": "fire",
    "no plate": "noPlate",
    "smoking": "smoking",
    "stunt riding": "stuntRiding",
    "triples": "triples",
    "with helmet": "withHelmet",
    "without helmet": "withoutHelmet"
}

real_violation_classes = [
    "fire", "phone usage", "smoking",
    "stunt riding", "triples", "without helmet"
]

np.random.seed(42)
class_colors = {name: tuple(np.random.randint(0, 255, size=3).tolist()) for name in real_violation_classes + ["no plate"]}

output_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'output_videos')
first_frame_dir = os.path.join(os.path.dirname(__file__), '..', 'snapshots')
os.makedirs(output_dir, exist_ok=True)
os.makedirs(first_frame_dir, exist_ok=True)

video_writer = None
recording = False
last_violation_time = 0
RECORD_DURATION = 5
current_video_path = ""
upload_interval = 1
last_upload_time = 0

# Video capture setup
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    print("Error: Could not open external camera. Trying laptop camera instead.")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open any camera.")
        exit()

frame_width = int(cap.get(3))
frame_height = int(cap.get(4))

mtcnn = MTCNN(keep_all=True, device='cuda' if torch.cuda.is_available() else 'cpu')

def initialize_video_writer():
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    video_filename = f"violation_{timestamp}.mp4"
    video_path = os.path.join(output_dir, video_filename)
    folder_path = os.path.join(first_frame_dir, f"violation_{timestamp}")
    os.makedirs(folder_path, exist_ok=True)
    
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    writer = cv2.VideoWriter(video_path, fourcc, 10.0, (frame_width, frame_height))
    if writer.isOpened():
        print(f"[🎥 Recording Started] {video_path}")
        return writer, video_path, folder_path
    else:
        print("[❌ Video Writer Init Error]")
        return None, "", ""

last_saved_coords = {}

while True:
    ret, frame = cap.read()
    if not ret:
        print("[❌ Frame Read Error]")
        break

    # --- STEP 1: Detect motorcycles first ---
    results_coco = yolo_coco(frame, classes=[3])  # class 3 = motorcycle in COCO
    motorcycle_found = any(len(r.boxes) > 0 for r in results_coco)

    if not motorcycle_found:
        # No motorcycle → show frame and skip processing
        cv2.imshow("Smart Traffic Violation Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        continue

    # --- STEP 2: Run custom violation detection only if motorcycle is present ---
    results = model_main(frame)[0]
    boxes = results.boxes

    # Detect faces & landmarks once per frame
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb_frame)
    face_boxes, _, face_landmarks = mtcnn.detect(pil_image, landmarks=True)

    violation_counts = {backend_name: 0 for backend_name in violation_map.values()}
    plate_image_url = None
    number_plate_coords = None
    current_time = time.time()

    for box in boxes:
        cls = int(box.cls[0])
        if cls >= len(class_names):
            continue

        name = class_names[cls]
        coords = box.xyxy[0].cpu().numpy().astype(int)

        if name == "with helmet":
            continue
        
        if name == "no plate":
            number_plate_coords = coords
            continue

        # ✅ Secondary check for phone usage / smoking
        if name in ["phone usage", "smoking"]:
            valid = False
            if face_boxes is not None and face_landmarks is not None:
                for lm in face_landmarks:
                    if name == "smoking":
                        mouth_x = int((lm[3][0] + lm[4][0]) / 2)
                        mouth_y = int((lm[3][1] + lm[4][1]) / 2)
                        if coords[0] < mouth_x < coords[2] and coords[1] < mouth_y < coords[3]:
                            valid = True
                            break
                    elif name == "phone usage":
                        ear_x = int((lm[0][0] + lm[1][0]) / 2)
                        ear_y = int((lm[0][1] + lm[1][1]) / 2)
                        if coords[0] < ear_x < coords[2] and coords[1] < ear_y < coords[3]:
                            valid = True
                            break
            if not valid:
                continue

        # --- Spatio-temporal filtering (avoid duplicates within 3s) ---
        cx, cy = (coords[0] + coords[2]) // 2, (coords[1] + coords[3]) // 2
        key = (name, cx // 20, cy // 20)
        if current_time - last_saved_coords.get(key, 0) < 3:
            continue
        last_saved_coords[key] = current_time

        if name in violation_map:
            backend_field = violation_map[name]
            violation_counts[backend_field] += 1
            color = class_colors.get(name, (255, 255, 255))
            cv2.rectangle(frame, tuple(coords[:2]), tuple(coords[2:]), color, 2)
            cv2.putText(frame, name, (coords[0], coords[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    violation_detected = any(v > 0 for v in violation_counts.values())

    # Play / stop alert sound
    if violation_detected:
        start_alert_sound()
    else:
        stop_alert_sound()

    # Upload plate image if found
    if violation_detected and number_plate_coords is not None:
        x1, y1, x2, y2 = number_plate_coords
        if x2 > x1 and y2 > y1:
            try:
                plate_crop = frame[y1:y2, x1:x2]
                _, plate_encoded = cv2.imencode('.jpg', plate_crop)
                plate_upload = cloudinary.uploader.upload(plate_encoded.tobytes(), resource_type="image")
                plate_image_url = plate_upload.get("secure_url", None)
                print(f"[✅ Plate Uploaded] {plate_image_url}")
            except Exception as e:
                print(f"[❌ Plate Upload Error] {e}")

    # Save frame to DB if interval reached
    if violation_detected and (current_time - last_upload_time >= upload_interval):
        try:
            _, encoded_frame = cv2.imencode('.jpg', frame)
            upload_result = cloudinary.uploader.upload(encoded_frame.tobytes(), resource_type="image")
            image_url = upload_result.get("secure_url", "")

            mongo_data = {
                "imageUrl": image_url,
                "plateImageUrl": plate_image_url if plate_image_url else None,
                **violation_counts,
                "analyzedAt": datetime.utcnow(),
                "videoFilename": os.path.basename(current_video_path) if current_video_path else None,
                "verified": False
            }

            collection.insert_one(mongo_data)
            print(f"[✅ MongoDB Saved] {mongo_data}")
        except Exception as e:
            print(f"[❌ MongoDB/Cloudinary Error] {e}")

        last_upload_time = current_time

    # Start recording + WhatsApp alert
    if violation_detected:
        last_violation_time = current_time
        if not recording:
            video_writer, current_video_path, folder_path = initialize_video_writer()
            recording = True if video_writer else False

        if recording:
            try:
                _, encoded_first = cv2.imencode('.jpg', frame)
                upload_result = cloudinary.uploader.upload(encoded_first.tobytes(), resource_type="image")
                image_url = upload_result.get("secure_url", "")

                # Send WhatsApp alert with only detected violation types
                detected_types = [k for k, v in violation_counts.items() if v > 0]
                message_text = "🚨 Violation Detected:\n" + ", ".join(detected_types)

                send_whatsapp_message_with_image(image_url, message_text)
            except Exception as e:
                print(f"[❌ WhatsApp Send Error] {e}")

    if recording:
        video_writer.write(frame)
        if current_time - last_violation_time > RECORD_DURATION:
            video_writer.release()
            recording = False
            print(f"[🛑 Recording Stopped] {current_video_path}")
            current_video_path = ""

    cv2.imshow("Smart Traffic Violation Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        if recording:
            video_writer.release()
            print(f"[🛑 Final Recording Stopped] {current_video_path}")
        break

cap.release()
stop_alert_sound()
if recording:
    video_writer.release()
cv2.destroyAllWindows()
