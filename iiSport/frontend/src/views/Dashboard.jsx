import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';




const Dashboard = () => {
  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const todayDate = new Date().toLocaleDateString();
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  function formatTo12Hour(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(+hours, +minutes);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: true,
  });
}


  useEffect(() => {
    // Fetch all events without filtering by user
    axios.get(`http://localhost:8080/api/users/${loggedUser.id}/events`)
      .then(res => {
        console.log("✅ All events fetched:", res.data);
        const allEvents = res.data;
        setEvents(allEvents);
        const today = dayjs().format('YYYY-MM-DD');

        const todayList = allEvents.filter(event =>
          dayjs(event.date).format('YYYY-MM-DD') === today
        );

        const futureList = allEvents.filter(event =>
          dayjs(event.date).isAfter(today)
        );

        setTodayEvents(todayList);
        setFutureEvents(futureList);
      })
      .catch(err => console.error(err));
  }, []);
 

  return (
    <div className='container'>
      <NavBar />

      <h2 className='mt-3'>Welcome {loggedUser.firstName}</h2>

      <h6>Today is {todayDate} and you have {todayEvents.length} events today</h6>

      <div className="mb-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location Name</th>
              <th>Attendee</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {todayEvents.map((event, idx) => (
              <tr key={idx}>
                <td>{event.eventName}</td>
                <td>{event.location}</td>
                <td>{event.attendee}</td>
                <td>{formatTo12Hour(event.time)}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <table className='table table-striped mt-3'>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location Name</th>
            <th>Attendees</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td><Link to={`/event/${event.id}`}>{event.eventName}</Link></td>
              <td>{event.location}</td>
              <td>{event.attendee}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
