import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeWidget, setActiveWidget] = useState(null);
  const [tasks, setTasks] = useState({
    progress: [],
    completed: [],
    tostart: []
  });
  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const navigate = useNavigate();

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Organize tasks by status
        const organizedTasks = {
          progress: response.data.filter(task => task.status === 'In Progress'),
          completed: response.data.filter(task => task.status === 'Completed'),
          tostart: response.data.filter(task => task.status === 'To Start')
        };
        setTasks(organizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("connectedUser");
    localStorage.removeItem("token");
    navigate('/login');
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh tasks after update
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const organizedTasks = {
        progress: response.data.filter(task => task.status === 'In Progress'),
        completed: response.data.filter(task => task.status === 'Completed'),
        tostart: response.data.filter(task => task.status === 'To Start')
      };
      setTasks(organizedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh tasks after delete
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const organizedTasks = {
        progress: response.data.filter(task => task.status === 'In Progress'),
        completed: response.data.filter(task => task.status === 'Completed'),
        tostart: response.data.filter(task => task.status === 'To Start')
      };
      setTasks(organizedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <HeaderWidget>
        <WelcomeText>Welcome, {loggedUser?.name}</WelcomeText>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </HeaderWidget>

      <BoardTitle>
        <h3>My Task Board</h3>
        <p>Tasks to keep organised</p>
      </BoardTitle>

      {/* Action Buttons */}
      <ButtonsContainer>
        <ActionButton 
          onClick={() => setActiveWidget('progress')}
          color="#f9d56e"
        >
          🍩 Tasks in Progress ({tasks.progress.length})
        </ActionButton>

        <ActionButton 
          onClick={() => setActiveWidget('completed')}
          color="#7bd389"
        >
          🌱 Completed Tasks ({tasks.completed.length})
        </ActionButton>

        <ActionButton 
          onClick={() => setActiveWidget('tostart')}
          color="#ec7e7f"
        >
          ☕ Tasks to Start ({tasks.tostart.length})
        </ActionButton>

        <ActionButton 
          onClick={() => setActiveWidget('create')}
          color="#2c4766"
        >
          ➕ Add New Task
        </ActionButton>
      </ButtonsContainer>

      {/* Widget Overlays */}
      {activeWidget && (
        <WidgetOverlay onClick={() => setActiveWidget(null)}>
          <WidgetPanel onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setActiveWidget(null)}>×</CloseButton>
            
            {activeWidget === 'create' ? (
              <CreateTaskWidget 
                onClose={() => setActiveWidget(null)} 
                setTasks={setTasks}
              />
            ) : (
              <TaskListWidget>
                <h3>{activeWidget === 'progress' ? 'In Progress' : 
                     activeWidget === 'completed' ? 'Completed' : 'To Start'} Tasks</h3>
                <ul>
                  {tasks[activeWidget].map((task) => (
                    <TaskItem key={task._id}>
                      <TaskTitle>{task.title}</TaskTitle>
                      <TaskDescription>{task.description}</TaskDescription>
                      <TaskDue>Due: {new Date(task.dueDate).toLocaleDateString()}</TaskDue>
                      <TaskPriority>Priority: {task.priority}</TaskPriority>
                      <TaskActions>
                        {activeWidget !== 'completed' && (
                          <CompleteButton 
                            onClick={() => handleTaskUpdate(task._id, 'Completed')}
                          >
                            Mark Complete
                          </CompleteButton>
                        )}
                        <DeleteButton 
                          onClick={() => handleTaskDelete(task._id)}
                        >
                          Delete
                        </DeleteButton>
                      </TaskActions>
                    </TaskItem>
                  ))}
                </ul>
              </TaskListWidget>
            )}
          </WidgetPanel>
        </WidgetOverlay>
      )}
    </DashboardContainer>
  );
};

// Create Task Widget Component
const CreateTaskWidget = ({ onClose, setTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(dueDate) < new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        dueDate,
        priority,
        status: "To Start"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update tasks state
      const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const organizedTasks = {
        progress: tasksResponse.data.filter(task => task.status === 'In Progress'),
        completed: tasksResponse.data.filter(task => task.status === 'Completed'),
        tostart: tasksResponse.data.filter(task => task.status === 'To Start')
      };
      setTasks(organizedTasks);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("Medium");
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error("Error creating task:", error);
      setErrors({ submit: "Failed to create task. Please try again." });
    }
  };

  return (
    <TaskFormContainer>
      <h3>Create New Task</h3>
      {success ? (
        <SuccessMessage>✅ Task created successfully!</SuccessMessage>
      ) : (
        <form onSubmit={handleSubmit}>
          {errors.submit && <ErrorText style={{ textAlign: 'center' }}>{errors.submit}</ErrorText>}
          
          <FormGroup>
            <label>Task Title*</label>
            <FormInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              $hasError={!!errors.title}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <label>Description*</label>
            <FormTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows="4"
              $hasError={!!errors.description}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <label>Due Date*</label>
            <FormInput
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              $hasError={!!errors.dueDate}
            />
            {errors.dueDate && <ErrorText>{errors.dueDate}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <label>Priority</label>
            <PriorityOptions>
              <PriorityOption 
                $active={priority === "High"}
                onClick={() => setPriority("High")}
              >
                🔥 High
              </PriorityOption>
              <PriorityOption 
                $active={priority === "Medium"}
                onClick={() => setPriority("Medium")}
              >
                ⚡ Medium
              </PriorityOption>
              <PriorityOption 
                $active={priority === "Low"}
                onClick={() => setPriority("Low")}
              >
                💤 Low
              </PriorityOption>
            </PriorityOptions>
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">
              Create Task
            </SubmitButton>
          </FormActions>
        </form>
      )}
    </TaskFormContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
`;

const HeaderWidget = styled.div`
  background: linear-gradient(135deg, #0ef, #2c4766);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const WelcomeText = styled.h4`
  margin: 0;
  font-size: 1.5rem;
`;

const LogoutButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const BoardTitle = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  background: ${props => props.color};
  color: white;
  border: none;
  padding: 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const WidgetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const WidgetPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const TaskListWidget = styled.div`
  h3 {
    color: #2c4766;
    margin-top: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
  }
`;

const TaskItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h4`
  margin: 0 0 0.5rem;
  color: #2c4766;
`;

const TaskDescription = styled.p`
  margin: 0 0 0.5rem;
  color: #666;
`;

const TaskDue = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #888;
`;

const TaskPriority = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #888;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CompleteButton = styled.button`
  background: #7bd389;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  background: #ec7e7f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const TaskFormContainer = styled.div`
  h3 {
    color: #2c4766;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#ff6b6b' : '#ddd'};
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s;

  &:focus {
    outline: none;
    border-color: #2c4766;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#ff6b6b' : '#ddd'};
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2c4766;
  }
`;

const PriorityOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PriorityOption = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.$active ? '#2c4766' : '#f0f2f5'};
  color: ${props => props.$active ? 'white' : '#555'};
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '600' : '400'};

  &:hover {
    background: ${props => props.$active ? '#1a365d' : '#e6e9ed'};
  }
`;

const ErrorText = styled.small`
  color: #ff6b6b;
  display: block;
  margin-top: 0.25rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f0f2f5;
  color: #555;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e6e9ed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #2c4766;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1a365d;
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: #d4edda;
  color: #155724;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
`;

export default Dashboard;