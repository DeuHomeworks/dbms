const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email,
      password
    });

    // Debug log
    console.log('Login response:', response.data);

    // Make sure these exact keys match what we're checking in ProjectsPage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);

    // Debug log
    console.log('Stored in localStorage:', {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId')
    });

    navigate('/projects');
  } catch (error) {
    console.error('Login error:', error);
    setError('Login failed. Please check your credentials.');
  }
}; 