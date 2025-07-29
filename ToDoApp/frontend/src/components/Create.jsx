import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from '../views/Navbar';

const Create = () => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [msg, setMsg] = useState("");

  // status defaults to "To start" on create, no need for input
  const status = "To start";

  const navigate = useNavigate();

  const handleTitle = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (val.length < 1) {
      setTitleError("❌ Title is required ❌");
    } else if (val.length < 3) {
      setTitleError("Title must be more than 3 characters");
    } else {
      setTitleError("");
    }
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
    if (val.length < 1) {
      setDescriptionError("❌ Description is required ❌");
    } else if (val.length < 3) {
      setDescriptionError("Description must be more than 3 characters");
    } else {
      setDescriptionError("");
    }
  };

  const handleDate = (e) => {
    const val = e.target.value;
    const selectedDate = new Date(val);
    const today = new Date();

    setDueDate(val);
    if (!val) {
      setDateError("❌ Due date is required ❌");
    } else if (selectedDate <= today) {
      setDateError("Due date must be in the future ⏳");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (titleError || descriptionError || dateError || title === "" || description === "") {
      setMsg("❌ Please fill the form correctly ❌");
      return;
    }

    const newTask = { title, description, dueDate, priority, status };
    console.log("✅ Task to submit:", newTask);

    const token = localStorage.getItem("token");

    axios.post("http://localhost:8000/api/tasks/create", newTask, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log("Task added:", res.data);
        setMsg("✅ Task added successfully!");

        // reset form
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("Medium");

        navigate("/tostart");
      })
      .catch((err) => {
        console.error("Error adding task:", err);
        setMsg("❌ Failed to add task");
      });
  };

  return (
    <>
      <Navbar />
      <div>
        <h2 className='text-center mt-3'>Create New Task</h2>
        <div className='mt-3'>
          <form className="p-4 border rounded-3 shadow-sm bg-light" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-center">Task Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={title}
                onChange={handleTitle}
                required />
              {titleError && <small className="text-danger">{titleError}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label text-center">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={description}
                onChange={handleDescription}
                rows="3"
              />
              {descriptionError && <small className="text-danger">{descriptionError}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label text-center">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={dueDate}
                onChange={handleDate} />
              {dateError && <small className="text-danger">{dateError}</small>}
            </div>

            <div className='mb-3'>
              <label className='form-label text-center'>Priority</label>
              <div className='d-flex gap-3'>
                <div className="form-check">
                  <input
                    type="radio"
                    id="high"
                    name="priority"
                    value="High"
                    className="form-check-input"
                    checked={priority === "High"}
                    onChange={(e) => setPriority(e.target.value)} />
                  <label htmlFor="high" className="form-check-label">🔥 High</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="medium"
                    name="priority"
                    value="Medium"
                    className="form-check-input"
                    checked={priority === "Medium"}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <label htmlFor="medium" className="form-check-label">⚡ Medium</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id="low"
                    name="priority"
                    value="Low"
                    className="form-check-input"
                    checked={priority === "Low"}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <label htmlFor="low" className="form-check-label">💤 Low</label>
                </div>
              </div>
            </div>

            {msg && <p className="text-center">{msg}</p>}

            <div className="d-flex justify-content-center mt-3">
              <button className='btn btn-primary text-center' type='submit'>Create</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
