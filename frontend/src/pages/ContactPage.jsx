import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/bg-3.jpg')`,
      }}
    >
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-black bg-opacity-70 backdrop-blur-md rounded-2xl shadow-xl p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="mb-8 text-gray-200">
            Have questions about Traffiscan? Fill out the form below and we’ll get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-60 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-60 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Type your message here..."
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-60 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-black bg-opacity-60 text-gray-300 text-center text-sm py-4">
        &copy; {new Date().getFullYear()} Traffiscan. All rights reserved.
      </footer>
    </div>
  );
}

export default ContactPage;
