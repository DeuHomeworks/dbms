import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Network error or server is down');
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Signup Page</h1>
      <form onSubmit={handleSignup} className="signup-form">
        <label className="signup-label">
          First Name:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </label>
        <br />
        <label className="signup-label">
          Last Name:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </label>
        <br />
        <label className="signup-label">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </label>
        <br />
        <label className="signup-label">
          Phone (optional):
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="signup-input"
          />
        </label>
        <br />
        <label className="signup-label">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </label>
        <br />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      {error && <p className="signup-error">{error}</p>}
      <p className="signup-login-link">
        Already have an account?{' '}
        <span
          className="signup-login-text"
          onClick={() => navigate('/')}
        >
          Log in here
        </span>
      </p>
    </div>
  );
}

export default SignupPage;
