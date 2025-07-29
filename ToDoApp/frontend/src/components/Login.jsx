import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });

      console.log('Login success:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <StyledWrapper>
      <div className="container register-wrapper d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
              <label>Password</label>
            </div>
            <div className="forgot-pass">
              <a href="#">Forgot your password?</a>
            </div>
            <button className="btn" type="submit">Login</button>
            <div className="signup-link">
              <Link to="/register">Sign Up</Link>
            </div>
          </form>
        </div>

        {/* Circular animation elements */}
        {[...Array(50)].map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    width: 400px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .container span {
    position: absolute;
    left: 0;
    width: 32px;
    height: 6px;
    background: #2c4766;
    border-radius: 80px;
    transform-origin: 200px;
    transform: rotate(calc(var(--i) * (360deg / 50)));
    animation: blink 3s linear infinite;
    animation-delay: calc(var(--i) * (3s / 50));
  }

  @keyframes blink {
    0% {
      background: #0ef;
    }
    25% {
      background: #2c4766;
    }
  }

  .login-box {
    position: absolute;
    width: 80%;
    max-width: 300px;
    z-index: 1;
    padding: 20px;
    border-radius: 20px;
  }

  form {
    width: 100%;
    padding: 0 10px;
  }

  h2 {
    font-size: 1.8em;
    color: #0ef;
    text-align: center;
    margin-bottom: 10px;
  }

  .input-box {
    position: relative;
    margin: 15px 0;
  }

  input {
    width: 100%;
    height: 45px;
    background: transparent;
    border: 2px solid #2c4766;
    outline: none;
    border-radius: 40px;
    font-size: 1em;
    color: #fff;
    padding: 0 15px;
    transition: 0.5s ease;
  }

  input:focus {
    border-color: #0ef;
  }

  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    top: -10px;
    font-size: 0.8em;
    background: #1f293a;
    padding: 0 6px;
    color: #0ef;
  }

  label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    font-size: 1em;
    pointer-events: none;
    transition: 0.5s ease;
    color: #fff;
  }

  .forgot-pass {
    margin: -10px 0 10px;
    text-align: center;
  }

  .forgot-pass a {
    font-size: 0.85em;
    color: #fff;
    text-decoration: none;
  }

  .btn {
    width: 100%;
    height: 45px;
    background: #0ef;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 1em;
    color: #1f293a;
    font-weight: 600;
  }

  .signup-link {
    margin: 10px 0;
    text-align: center;
  }

  .signup-link a {
    font-size: 1em;
    color: #0ef;
    text-decoration: none;
    font-weight: 600;
  }
`;

export default Login;
