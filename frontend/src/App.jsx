import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import Photos from './dashboard/Photos.jsx';
import Videos from './dashboard/videos.jsx';
import Statistics from './dashboard/statstics.jsx';
import Reports from './dashboard/report.jsx';
import History from './dashboard/history.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/dashboard/photos" element={<Photos />} />
      <Route path="/dashboard/videos" element={<Videos />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/history" element={<History />} />


    </Routes>
  );
}

export default App;


