import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const OneUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();


  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPassword(''); // Don't prefill hashed password
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleUpdate = () => {
  const updatedUser = {
    firstName,
    lastName,
    password: password.trim() !== '' ? password : user.password
  };

  axios.put(`http://localhost:8080/api/users/${id}`, updatedUser)
    .then(res => {
      setUser(res.data);
      navigate(`/user/${id}`);
    })
    .catch(err => {
      setError(err.response?.data?.message || "Update failed");
    });
};


  return (
    <div className="container mt-4">
      <NavBar />
      {error && <p className="text-danger">{error}</p>}

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h4>Edit User Details</h4>

          <label>First Name:</label>
          <input
            className="form-control mb-2"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>Last Name:</label>
          <input
            className="form-control mb-2"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label>Password (leave blank to keep current):</label>
          <input
            className="form-control mb-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary mt-2" onClick={handleUpdate}>
            Update
          </button>
              
          
        </div>
      )}
    </div>
  );
};

export default OneUser;
