import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import your page components (You'll need to create these files)
import HomePage from './pages/HomePage';
import SkinDiagnosisPage from './pages/SkinDiagnosisPage';
import DigestiveDiagnosisPage from './pages/DigestiveDiagnosisPage';
import NotFoundPage from './pages/NotFoundPage'; // Keep NotFoundPage separate or decide if it needs layout

// Import basic styling (Vite might provide App.css or you can create it)
import './App.css';

function App() {
  return (
    // BrowserRouter wraps your app to enable routing
    <BrowserRouter>
      {/* Optional: You could add a common Header/Navbar here, outside <Routes>
          Example:
          <header>
            <nav>
              <Link to="/">Home</Link> | {' '}
              <Link to="/diagnose/skin">Skin Diagnosis</Link> | {' '}
              <Link to="/diagnose/digestive">Digestive Diagnosis</Link>
            </nav>
          </header>
      */}

      {/* Routes component defines the different routes */}
      <Routes>
        {/* Route for the Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Route for the Skin Diagnosis Page */}
        <Route path="/diagnose/skin" element={<SkinDiagnosisPage />} />

        {/* Route for the Digestive Diagnosis Page */}
        <Route path="/diagnose/digestive" element={<DigestiveDiagnosisPage />} />

        {/* Optional: Catch-all route for pages not found (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Optional: You could add a common Footer here, outside <Routes> */}
    </BrowserRouter>
  );
}

export default App;