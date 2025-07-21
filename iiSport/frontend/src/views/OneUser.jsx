import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';


const OneUser = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message));
  }, [id]);

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }
};


  return (
    <div className="container mt-4">
      <NavBar />

      {error && <p className="text-danger">{error}</p>}
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className='d-flex mt-5 gap-5'>
          <h4>User Details</h4>
          <div className='w-50'>
            <h6>Name: {user.firstName} {user.lastName}</h6>

            <h6>Email: {user.email}</h6>

            <h6>Password: {'*'.repeat(user.password.length)}</h6>

            <Link to={`/user/edit/${user.id}`}>Edit</Link>

          </div>
          <div className='w-50'>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <img
            className='mt-5 w-50'
            src={previewUrl}
            alt="Profile Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OneUser;
