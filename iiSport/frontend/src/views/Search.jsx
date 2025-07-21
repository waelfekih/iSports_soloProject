import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Search = () => {
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("Event Name");

  useEffect(() => {
    axios.get('http://localhost:8080/api/events')
      .then(res => {
        console.log("✅ All events fetched:", res.data);
        setEvents(res.data);
        setFilteredEvents(res.data); 
      })
      .catch(err => console.error("❌ Failed to fetch events:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchValue.toLowerCase();

    const filtered = events.filter(event => {
      switch (searchBy) {
        case 'Event Name':
          return event.eventName.toLowerCase().includes(value);
        case 'Location':
          return event.location.toLowerCase().includes(value);
        case 'Attendees':
          return event.attendee.toString().includes(value);
        case 'Date':
          return new Date(event.date).toLocaleDateString().includes(value);
        case 'Time':
          return event.time?.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    setFilteredEvents(filtered);
  };

  return (
    <div>
      <NavBar />
      <div className="container py-4 d-flex flex-column align-items-center">
        <form
          onSubmit={handleSearch}
          className="d-flex align-items-center gap-3 w-100"
          style={{ maxWidth: "900px" }}
        >
          <input
            type="search"
            className="form-control"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ maxWidth: "300px" }}
          />

          <div className="d-flex align-items-center gap-2">
            <label htmlFor="searchBy" className="form-label mb-1 small text-muted text-nowrap">
              Search By
            </label>
            <select
              id="searchBy"
              className="form-select"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option>Event Name</option>
              <option>Location</option>
              <option>Attendees</option>
              <option>Date</option>
              <option>Time</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <table className='table table-striped mt-3 w-100' style={{ maxWidth: "900px" }}>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location Name</th>
              <th>Attendees</th>
              <th>Date</th>
              <th>Creator</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr key={event.id}>
                  <td><Link to={`/event/${event.id}`}>{event.eventName}</Link></td>
                  <td>{event.location}</td>
                  <td>{event.attendee}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    {event.user ? (
                      <Link to={`/user/${event.user.id}`}>
                      {`${event.user.firstName} ${event.user.lastName}`}
                      </Link>
                      ) : (
                      'Unknown'
                      )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No matching events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Search;
