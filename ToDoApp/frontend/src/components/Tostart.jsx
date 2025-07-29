import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../views/Navbar';

const Tostart = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view tasks.");
      return;
    }

    axios.get('http://localhost:8000/api/tasks/alltasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const toStartTasks = response.data.filter(task => task.status === 'To start');
        setTasks(toStartTasks);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load tasks");
      });
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      <div className='container mt-3'>
        <h2 className='text-center mb-4'>Tasks to Start</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        {tasks.length > 0 ? (
          <table className="table table-bordered table-hover">
            <thead className="table-dark text-center">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{formatDate(task.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No tasks to start.</p>
        )}
      </div>
    </>
  );
};

export default Tostart;
