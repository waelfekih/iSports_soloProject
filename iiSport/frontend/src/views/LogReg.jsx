import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const LogReg = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("❌ Registration failed:", result);
        setErrors(result || { message: 'Registration failed' });
      } else {
        alert('Registered successfully');
        navigate("/dashboard");
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          birthDate: ''
        });
        setErrors({});
      }
    } catch (err) {
      console.error('🔥 Registration error:', err);
      setErrors({ message: 'Something went wrong. Please try again later.' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', loginData);
      console.log("✅ Login successful", response.data);
      localStorage.setItem("connectedUser", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login failed", error);
      if (error.response?.data?.message) {
        setErrors({ message: error.response.data.message });
      } else {
        setErrors({ message: "Login failed. Please try again." });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3 gradient-shine">iSport</h1>
      <h6 className="text-center mb-5">Free Pickup Game Finder and Organizer</h6>

      <div className="row justify-content-center">
        {/* Registration Form */}
        <div className="col-md-5">
          <h3>New User Registration</h3>
          <form onSubmit={handleRegisterSubmit}>
            {['firstName', 'lastName', 'email', 'password', 'birthDate'].map((field) => (
              <div className="mb-3" key={field}>
                <label htmlFor={field} className="form-label">
                  {field === 'birthDate' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'password' ? 'password' : field === 'birthDate' ? 'date' : 'text'}
                  name={field}
                  className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                  value={registerData[field]}
                  onChange={handleRegisterChange}
                  autoComplete={field === 'password' ? 'new-password' : 'off'}
                />
                {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
              </div>
            ))}
            {errors.message && <div className="text-danger mb-3">{errors.message}</div>}
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="col-md-5">
          <h3>Log In</h3>
          <form onSubmit={handleLoginSubmit}>
            {['email', 'password'].map((field) => (
              <div className="mb-3" key={field}>
                <label htmlFor={field} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                  value={loginData[field]}
                  onChange={handleLoginChange}
                  autoComplete={field === 'password' ? 'current-password' : 'email'}
                />
                {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
              </div>
            ))}
            {errors.message && <div className="text-danger mb-3">{errors.message}</div>}
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogReg;
