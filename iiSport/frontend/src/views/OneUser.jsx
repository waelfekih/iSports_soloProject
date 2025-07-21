import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';




const OneUser = () => {
  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

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

useEffect(() => {
    // Fetch all events without filtering by user
    axios.get(`http://localhost:8080/api/users/${loggedUser.id}/events`)
      .then(res => {
        console.log("✅ All events fetched:", res.data);
        const allEvents = res.data;
        setPastEvents(allEvents);
        const today = dayjs().format('YYYY-MM-DD');

        const pastList = allEvents.filter(event =>
        dayjs(`${event.date}T${event.time}`).isBefore(today)
        );

        const futureList = allEvents.filter(event =>
          dayjs(event.date).isAfter(today)
        );

        setPastEvents(pastList);
        setFutureEvents(futureList);
      })
      .catch(err => console.error(err));
  }, []);


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
      <div className='mt-3'>
        <h6>Event History</h6>
        <ul>
          {pastEvents.map((event, idx) => (
          <li key={idx}>{event.eventName}</li>
          ))}
        </ul>

        <h6>Future</h6>
        <ul>
          {futureEvents.map((event, idx) => (
          <li key={idx}>{event.eventName}</li>
          ))}
        </ul>

      </div>
      
      
      


    </div>
  );
};

export default OneUser;
