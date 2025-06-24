import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet

// Import shared components like Header or Footer if you have them
import Header from '../components/Header'; // Assuming you have/want a Header component
// import Footer from '../components/Footer'; // Assuming you have/want a Footer component

// Optional: Import layout-specific CSS if needed
// import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout"> {/* Optional wrapper div for overall layout styling */}

      {/* Render the shared Header component */}
      {/* If you don't have a Header, you can remove this line */}
      <Header />

      {/* The <main> tag is semantically appropriate for primary page content */}
      {/* The 'App' class from App.css can provide consistent padding/max-width */}
      <main className="App">
        {/* Outlet is the placeholder where matched child route components will be rendered */}
        <Outlet />
      </main>

      {/* Render the shared Footer component */}
      {/* If you don't have a Footer, you can remove this line */}
      {/* <Footer /> */}

    </div>
  );
}

export default MainLayout;