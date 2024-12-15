import React from 'react';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';
import FeaturesPage from './pages/Features';
import PricingPage from './pages/pricing';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import './styles/Global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/About';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
