import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:8080/api/logout')
      .then((res) => {
        console.log("Logged out:", res.data);
        navigate('/');
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  return (
    <nav className="container nav nav-pills d-flex justify-content-between align-items-center mt-4">
      <div className="d-flex gap-3">
        <Link className="nav-link active" to="/dashboard">Home</Link>
        <Link className="nav-link active" to="/new">New</Link>
        <Link className="nav-link active" to="/search">Search</Link>
        <Link className="nav-link active" to="/account">Account</Link>
      </div>
      <div>
        <button className="btn btn-danger" onClick={handleLogout}>LogOut</button>
      </div>
    </nav>
  );
};

export default NavBar;
