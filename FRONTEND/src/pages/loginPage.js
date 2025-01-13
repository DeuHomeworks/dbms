// Import necessary libraries and styles
import React, { useState } from 'react'; // React core library and the useState hook for state management
import { useNavigate } from 'react-router-dom'; // useNavigate hook to programmatically navigate between routes
import '../styles/login.css'; // Import CSS file for login page styling

// Define the LoginPage component
function LoginPage() {
  const [email, setEmail] = useState(''); // State to store the email input
  const [password, setPassword] = useState(''); // State to store the password input
  const [error, setError] = useState(''); // State to display error messages
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear any existing error messages

    try {
      // Make an HTTP POST request to the login API endpoint
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST', // Specify the HTTP method
        credentials: 'include', // Include credentials (e.g., cookies) in the request
        headers: {
          'Content-Type': 'application/json', // Indicate the request body format
        },
        body: JSON.stringify({ email, password }), // Convert the email and password to a JSON string
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        // If the response is successful, store the token in localStorage
        localStorage.setItem('token', data.token);
        navigate('/projects/'); // Navigate to the projects page
      } else {
        // If the response is unsuccessful, display an error message
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Error logging in:', error);
      setError('Network error or server is down');
    }
  };

  return (
    <div className="login-container"> {/* Container for the login page layout */}
      <h1 className="login-title">Login Page</h1> {/* Page title */}
      <form onSubmit={handleLogin} className="login-form"> {/* Login form */}
        <label className="login-label">
          Email:
          <input
            type="text"
            value={email} // Bind the input value to the email state
            onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
            required // Mark the input as required
            className="login-input"
          />
        </label>
        <br />
        <label className="login-label">
          Password:
          <input
            type="password"
            value={password} // Bind the input value to the password state
            onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            required // Mark the input as required
            className="login-input"
          />
        </label>
        <br />
        <button type="submit" className="login-button">Login</button> {/* Submit button */}
      </form>
      {error && <p className="login-error">{error}</p>} {/* Display error messages if any */}
      <p className="login-signup-link">
        Don’t have an account?{' '}
        <span
          className="login-signup-text"
          onClick={() => navigate('/Signup')} // Navigate to the signup page when clicked
        >
          Sign up here
        </span>
      </p>
    </div>
  );
}

// Export the LoginPage component as the default export
export default LoginPage;
