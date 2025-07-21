import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import styled from 'styled-components';

const OneEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/events/${id}`)
      .then((res) => {
        console.log(res.data);
        setEvent(res.data);
      })
      .catch((err) => {
        console.error("Error fetching event details:", err);
      });
  }, [id]);

  if (event === null) {
    return <h2>Loading event details...</h2>;
  }

  return (
    <div>
      <NavBar />
      <StyledWrapper>
        <div className="event-card">
          <h2>{event.eventName}</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
      </StyledWrapper>
    </div>
  );
};

export default OneEvent;

// You can style as needed
const StyledWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;

  .event-card {
    padding: 2rem;
    background: #f4f4f4;
    border-radius: 12px;
    width: 400px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  h2 {
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
`;
