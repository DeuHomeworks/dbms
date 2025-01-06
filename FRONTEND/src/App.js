// Import necessary libraries and components
import React from 'react'; // React core library for building user interfaces
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
// BrowserRouter: Provides routing capabilities
// Routes: Groups all route definitions
// Route: Defines individual routes
// useLocation: Hook to access the current location (pathname)

import HomePage from './pages/homePage'; // Home page component
import LoginPage from './pages/loginPage'; // Login page component
import SignupPage from './pages/signupPage'; // Signup page component
import FeaturesPage from './pages/Features'; // Features page component
import PricingPage from './pages/pricing'; // Pricing page component
import Navbar from './components/Navbar'; // Navbar component for site navigation
import Footer from './components/Footer'; // Footer component for site footer
import ProjectsPage from './pages/projectspage'; // Projects page component
import AboutPage from './pages/About'; // About page component
import './styles/Global.css'; // Global stylesheet for consistent styles across the app

// A helper component to conditionally render the Navbar and Footer based on the current route
function Layout({ children }) {
  const location = useLocation(); 
  // useLocation provides the current URL path, useful for conditionally rendering components

  // Determine if the Navbar and Footer should be displayed based on the current path
  const showLayout = location.pathname === '/' || 
                     location.pathname === '/about' || 
                     location.pathname === '/features' || 
                     location.pathname === '/pricing' || 
                     location.pathname === '/login' || 
                     location.pathname === '/signup';

  return (
    <>
      {showLayout && <Navbar />} 
      {/* Render Navbar if the current path matches one of the specified routes */}
      {children} 
      {/* Render the main content (passed as children) */}
      {showLayout && <Footer />} 
      {/* Render Footer if the current path matches one of the specified routes */}
    </>
  );
}

// Main application component
function App() {
  return (
    <Router>
      {/* Router wraps the entire application, enabling client-side routing */}
      <Layout>
        {/* Layout wraps around the routes, ensuring Navbar/Footer conditional rendering */}
        <Routes>
          {/* Define all the application routes */}
          <Route path="/" element={<HomePage />} /> 
          {/* Home page route */}
          <Route path="/login" element={<LoginPage />} /> 
          {/* Login page route */}
          <Route path="/signup" element={<SignupPage />} /> 
          {/* Signup page route */}
          <Route path="/features" element={<FeaturesPage />} /> 
          {/* Features page route */}
          <Route path="/pricing" element={<PricingPage />} /> 
          {/* Pricing page route */}
          <Route path="/about" element={<AboutPage />} /> 
          {/* About page route */}
          <Route path="/projects" element={<ProjectsPage />} /> 
          {/* Projects page route (doesn't show Navbar/Footer due to Layout logic) */}
        </Routes>
      </Layout>
    </Router>
  );
}

// Export the main App component as default for use in other parts of the application
export default App; 
