import React from 'react';
import '../styles/About.css'; // Import the CSS file

function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        Welcome to our project management web application. Our platform is designed to help teams collaborate efficiently and manage their projects effectively.
      </p>
      <p className="mb-4">
        Similar to Jira, our application offers a range of features including task tracking, project planning, and team collaboration tools. Whether you are a small team or a large organization, our platform can be customized to fit your needs.
      </p>
      <p className="mb-4">
        Our team is composed of experienced professionals who are passionate about their work. We are dedicated to providing the best service possible and continuously improving our platform to meet the evolving needs of our users.
      </p>
      <p>
        Thank you for choosing our project management web application. We look forward to helping you achieve your project goals.
      </p>
    </div>
  );
}

export default About;
