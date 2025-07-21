import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import NavBar from '../components/NavBar';

const New = () => {
  const [eventName, setEventName] = useState("");
  const [eventNameError, setEventNameError] = useState("");
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [attendee, setAttendee] = useState(0);
  const [attendeeError, setAttendeeError] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [time, setTime] = useState("");
  const [timeError, setTimeError] = useState(""); 
  const [msg, setMsg] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));

  const navigate = useNavigate();

  // Your handlers with fixes:

  const handleEventName = (e) => {
    const val = e.target.value;
    setEventName(val);
    if (val.length < 1) {
      setEventNameError("❌ Event Name is required ❌");
    } else if (val.length < 3) {
      setEventNameError("Event Name must be more than 3 characters");
    } else {
      setEventNameError("");
    }
  };

  const handleLocation = (e) => {
    const val = e.target.value;
    setLocation(val);
    if (val.length < 1) {
      setLocationError("❌ Location is required ❌"); // fixed from setAuthorError to setLocationError
    } else if (val.length < 3) {
      setLocationError("Location must be more than 3 characters");
    } else {
      setLocationError("");
    }
  };

  const handleAttendee = (e) => {
    const value = parseInt(e.target.value, 10);
    setAttendee(e.target.value); // keep as string to allow empty input
    if (isNaN(value) || value < 1) {
      setAttendeeError("❌ Attendees must be more than 0 ❌");
    } else {
      setAttendeeError("");
    }
  };

  const handleDate = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);

    const today = new Date();
    const inputDate = new Date(selectedDate);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (!selectedDate) {
      setDateError("❌ Date is required ❌");
    } else if (inputDate <= today) {
      setDateError("❌ Date must be in the future ❌");
    } else {
      setDateError("");
    }
  };

  const handleTime = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);

    if (!selectedTime) {
      setTimeError("❌ Time is required ❌");
    } else {
      setTimeError("");
    }
  };

  // Your validate function that returns errors
  const validate = () => {
    const errors = {};
    if (!eventName || eventName.length < 3) errors.eventName = "Event Name must be at least 3 characters";
    if (!location || location.length < 3) errors.location = "Location must be at least 3 characters";
    const attendeeNumber = parseInt(attendee, 10);
    if (!attendee || isNaN(attendeeNumber) || attendeeNumber < 1) errors.attendee = "Attendees must be more than 0";
    if (!date) errors.date = "Date is required";
    else {
      const today = new Date();
      const inputDate = new Date(date);
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate <= today) errors.date = "Date must be in the future";
    }
    if (!time) errors.time = "Time is required";
    return errors;
  };

  // Single handleSubmit with fixed validation and request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    // Set individual error states for displaying under inputs
    setEventNameError(validationErrors.eventName || "");
    setLocationError(validationErrors.location || "");
    setAttendeeError(validationErrors.attendee || "");
    setDateError(validationErrors.date || "");
    setTimeError(validationErrors.time || "");

    if (Object.keys(validationErrors).length > 0) {
      setMsg("❌ Please fill the form correctly ❌");
      return;
    }

    setMsg(""); // clear previous messages

    const newEvent = {
      eventName,
      location,
      attendee: parseInt(attendee, 10),
      date,
      time,
      user: { id: loggedUser.id }
    };

    try {
      await axios.post("http://localhost:8080/api/events", newEvent);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating event:", err);
      setMsg("Failed to create event.");
    }
  };

  return (
    <div className='container'>
      <NavBar />
      <h2>New Event</h2>

      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            className={`form-control ${eventNameError ? 'is-invalid' : ''}`}
            value={eventName}
            onChange={handleEventName}
          />
          {eventNameError && <div className="invalid-feedback">{eventNameError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className={`form-control ${locationError ? 'is-invalid' : ''}`}
            value={location}
            onChange={handleLocation}
          />
          {locationError && <div className="invalid-feedback">{locationError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Number of Attendees</label>
          <input
            type="number"
            className={`form-control ${attendeeError ? 'is-invalid' : ''}`}
            value={attendee}
            onChange={handleAttendee}
            min="1"
          />
          {attendeeError && <div className="invalid-feedback">{attendeeError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className={`form-control ${dateError ? 'is-invalid' : ''}`}
            value={date}
            onChange={handleDate}
          />
          {dateError && <div className="invalid-feedback">{dateError}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            className={`form-control ${timeError ? 'is-invalid' : ''}`}
            value={time}
            onChange={handleTime}
          />
          {timeError && <div className="invalid-feedback">{timeError}</div>}
        </div>

        <button className="btn btn-primary">Create Event</button>
      </form>
    </div>
  );
};

export default New;
