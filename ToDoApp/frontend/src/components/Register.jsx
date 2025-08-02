import React , { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigate = useNavigate();


  // Handlers for validation
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.length < 1) {
      setFirstNameError("❌ Firstname is required ❌");
    } else if (e.target.value.length < 2) {
      setFirstNameError("Firstname must be at least 2 characters");
    } else setFirstNameError("");
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
    if (e.target.value.length < 1) {
      setLastNameError("❌ Lastname is required ❌");
    } else if (e.target.value.length < 2) {
      setLastNameError("Lastname must be at least 2 characters");
    } else setLastNameError("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.includes("@")) {
      setEmailError("Invalid email format");
    } else setEmailError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else setPasswordError("");
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else setConfirmPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra check before submission
    if (
      !firstName || !lastName || !email || !password || !confirmPassword ||
      firstNameError || lastNameError || emailError || passwordError || confirmPasswordError
    ) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/user/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="container register-wrapper d-flex justify-content-center align-items-center min-vh-100">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>

        <div className="flex">
            <label>
            <input
              className="input"
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleFirstName}
              required
            />
            <span>Firstname</span>
            {firstNameError && <p className="error text-danger">{firstNameError}</p>}
          </label>
          
          <label>
            <input
              className="input"
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleLastName}
              required
            />
            <span>Lastname</span>
            {lastNameError && <p className="error text-danger">{lastNameError}</p>}
          </label>
        </div>

        <label>
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
            required
          />
          <span>Email</span>
          {emailError && <p className="error text-danger">{emailError}</p>}
        </label>
        <label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            required
          />
          <span>Password</span>
          {passwordError && <p className="error text-danger">{passwordError}</p>}
        </label>
        <label>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            required
          />
          <span>Confirm password</span>
          {confirmPasswordError && <p className="error text-danger">{confirmPasswordError}</p>}
        </label>

        <button className="submit">Register</button>
        <p className="signin">
          Already have an account? <a href="/login">Signin</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
