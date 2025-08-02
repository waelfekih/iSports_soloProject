import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../views/Navbar';
import Footer from './Footer';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// Add request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("connectedUser");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Dashboard = () => {
  const [activeWidget, setActiveWidget] = useState(null);
  const [tasks, setTasks] = useState({
    progress: [],
    completed: [],
    pending: []
  });
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const navigate = useNavigate();

  // Verify token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
    }
  }, []);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/tasks');
        
        const organizedTasks = {
          progress: response.data.filter(task => task.status === 'In Progress'),
          completed: response.data.filter(task => task.status === 'Completed'),
          pending: response.data.filter(task => task.status === 'Pending')
        };
        setTasks(organizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("connectedUser");
    localStorage.removeItem("token");
    navigate('/login');
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      if (!taskId) throw new Error("Task ID is required");
      
      const response = await api.put(`/task/${taskId}`, { status: newStatus });
      
      if (response.status === 200) {
        await refreshTasks();
        return response.data;
      }
      throw new Error(response.data.message || "Failed to update task status");
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response?.status === 404) {
        await refreshTasks();
      }
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      if (!taskId) throw new Error("Task ID is required");
      
      if (!window.confirm('Are you sure you want to delete this task?')) {
        return;
      }

      const response = await api.delete(`/task/${taskId}`);
      
      if (response.status === 200) {
        await refreshTasks();
        if (viewingTask?._id === taskId) {
          setViewingTask(null);
        }
        alert('Task deleted successfully');
      } else {
        throw new Error(response.data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
      
      if (error.response?.status === 404) {
        await refreshTasks();
      }
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      if (!taskId) throw new Error("Task ID is required");
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("Update data is required");
      }

      const response = await api.put(`/task/${taskId}`, updateData);
      
      if (response.status === 200) {
        await refreshTasks();
        return response.data;
      }
      throw new Error(response.data.message || "Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const refreshTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const organizedTasks = {
        progress: response.data.filter(task => task.status === 'In Progress'),
        completed: response.data.filter(task => task.status === 'Completed'),
        pending: response.data.filter(task => task.status === 'Pending')
      };
      setTasks(organizedTasks);
    } catch (error) {
      console.error("Error refreshing tasks:", error);
      throw error;
    }
  };

  const openEditWidget = (task) => {
    setEditingTask(task);
    setActiveWidget('edit');
  };

  const openViewWidget = async (taskId) => {
    try {
      const response = await api.get(`/task/${taskId}`);
      setViewingTask(response.data);
      setActiveWidget('view');
    } catch (error) {
      console.error("Error fetching task details:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  return (
    <DashboardContainer>
      <Navbar />

      <BoardTitle className='mt-3'>
        <h3>My Task Board</h3>
        <p>Tasks to keep organised</p>
      </BoardTitle>

      <ButtonsContainer>
        <ActionButton onClick={() => setActiveWidget('progress')} color="#f9d56e">
          🍩 In Progress ({tasks.progress.length})
        </ActionButton>
        <ActionButton onClick={() => setActiveWidget('completed')} color="#7bd389">
          🌱 Completed ({tasks.completed.length})
        </ActionButton>
        <ActionButton onClick={() => setActiveWidget('pending')} color="#ec7e7f">
          ☕ Pending ({tasks.pending.length})
        </ActionButton>
        <ActionButton onClick={() => setActiveWidget('create')} color="#2c4766">
          ➕ Add New Task
        </ActionButton>
      </ButtonsContainer>

      {activeWidget && (
        <WidgetOverlay onClick={() => {
          setActiveWidget(null);
          setEditingTask(null);
          setViewingTask(null);
        }}>
          <WidgetPanel onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => {
              setActiveWidget(null);
              setEditingTask(null);
              setViewingTask(null);
            }}>×</CloseButton>
            
            {activeWidget === 'create' ? (
              <TaskFormWidget 
                onClose={() => setActiveWidget(null)} 
                refreshTasks={refreshTasks}
                mode="create"
              />
            ) : activeWidget === 'edit' ? (
              <TaskFormWidget 
                onClose={() => {
                  setActiveWidget(null);
                  setEditingTask(null);
                }}
                refreshTasks={refreshTasks}
                mode="edit"
                task={editingTask}
              />
            ) : activeWidget === 'view' ? (
              <TaskDetailsWidget 
                task={viewingTask}
                formatDate={formatDate}
                onClose={() => {
                  setActiveWidget(null);
                  setViewingTask(null);
                }}
                onEdit={() => {
                  setEditingTask(viewingTask);
                  setActiveWidget('edit');
                }}
                onDelete={handleTaskDelete}
              />
            ) : (
              <TaskListWidget>
                <h3>{activeWidget === 'progress' ? 'In Progress' : 
                     activeWidget === 'completed' ? 'Completed' : 'Pending'} Tasks</h3>
                {isLoading ? (
                  <LoadingMessage>Loading tasks...</LoadingMessage>
                ) : tasks[activeWidget].length === 0 ? (
                  <EmptyMessage>No tasks in this category</EmptyMessage>
                ) : (
                  <ul>
                    {tasks[activeWidget].map((task) => (
                      <TaskItem key={task._id}>
                        <TaskTitle>{task.title}</TaskTitle>
                        <TaskContent>{task.content.substring(0, 50)}...</TaskContent>
                        <TaskMeta>
                          <span>Priority: {task.priority}</span>
                          <span>Status: {task.status}</span>
                        </TaskMeta>
                        <TaskActions>
                          <ActionButton color="#3a86ff" onClick={() => openViewWidget(task._id)}>
                            Details
                          </ActionButton>
                          <ActionButton color="#2c4766" onClick={() => openEditWidget(task)}>
                            Edit
                          </ActionButton>
                          {task.status !== 'Completed' && (
                            <ActionButton 
                              color="#7bd389" 
                              onClick={() => handleTaskStatusUpdate(task._id, 'Completed')}
                            >
                              Complete
                            </ActionButton>
                          )}
                          <ActionButton 
                            color="#ec7e7f" 
                            onClick={() => handleTaskDelete(task._id)}
                          >
                            Delete
                          </ActionButton>
                        </TaskActions>
                      </TaskItem>
                    ))}
                  </ul>
                )}
              </TaskListWidget>
            )}
          </WidgetPanel>
        </WidgetOverlay>
      )}
      <Footer/>
    </DashboardContainer>
  );
};

const TaskDetailsWidget = ({ task, formatDate, onClose, onEdit, onDelete }) => {
  return (
    <TaskDetailsContainer>
      <h3>Task Details</h3>
      
      <DetailGroup>
        <DetailLabel>Title:</DetailLabel>
        <DetailValue>{task.title}</DetailValue>
      </DetailGroup>
      
      <DetailGroup>
        <DetailLabel>Content:</DetailLabel>
        <DetailContent>{task.content}</DetailContent>
      </DetailGroup>
      
      <DetailGroup>
        <DetailLabel>Priority:</DetailLabel>
        <DetailValue>{task.priority}</DetailValue>
      </DetailGroup>
      
      <DetailGroup>
        <DetailLabel>Status:</DetailLabel>
        <DetailValue>{task.status}</DetailValue>
      </DetailGroup>
      
      <DetailGroup>
        <DetailLabel>Created At:</DetailLabel>
        <DetailValue>{formatDate(task.createdAt)}</DetailValue>
      </DetailGroup>
      
      <DetailGroup>
        <DetailLabel>Last Updated:</DetailLabel>
        <DetailValue>{formatDate(task.updatedAt)}</DetailValue>
      </DetailGroup>
      
      <DetailActions>
        <ActionButton color="#2c4766" onClick={onEdit}>
          Edit Task
        </ActionButton>
        <ActionButton color="#ec7e7f" onClick={() => onDelete(task._id)}>
          Delete Task
        </ActionButton>
        <ActionButton color="#666" onClick={onClose}>
          Close
        </ActionButton>
      </DetailActions>
    </TaskDetailsContainer>
  );
};

const TaskFormWidget = ({ onClose, refreshTasks, mode, task }) => {
  const [formData, setFormData] = useState({
    title: mode === 'edit' ? task.title : "",
    content: mode === 'edit' ? task.content : "",
    priority: mode === 'edit' ? task.priority : "Medium",
    status: mode === 'edit' ? task.status : "Pending"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate form
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    
    try {
      if (mode === 'edit') {
        await api.put(`/task/${task._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      
      await refreshTasks();
      onClose();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        "Failed to save task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <TaskFormContainer>
      <h3>{mode === 'edit' ? 'Edit Task' : 'Create New Task'}</h3>
      
      {submitError && (
        <ErrorText style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {submitError}
        </ErrorText>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Task Title*</label>
          <FormInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            $hasError={!!errors.title}
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <label>Content*</label>
          <FormTextarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter task content"
            rows="4"
            $hasError={!!errors.content}
          />
          {errors.content && <ErrorText>{errors.content}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <label>Priority</label>
          <PriorityOptions>
            {['High', 'Medium', 'Low'].map((level) => (
              <PriorityOption 
                key={level}
                $active={formData.priority === level}
                onClick={() => setFormData(prev => ({ ...prev, priority: level }))}
              >
                {level === 'High' ? '🔥 High' : 
                 level === 'Medium' ? '⚡ Medium' : '💤 Low'}
              </PriorityOption>
            ))}
          </PriorityOptions>
        </FormGroup>

        {mode === 'edit' && (
          <FormGroup>
            <label>Status</label>
            <StatusOptions>
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <StatusOption
                  key={status}
                  $active={formData.status === status}
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                >
                  {status}
                </StatusOption>
              ))}
            </StatusOptions>
          </FormGroup>
        )}

        <FormActions>
          <CancelButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 
             mode === 'edit' ? 'Update Task' : 'Create Task'}
          </SubmitButton>
        </FormActions>
      </form>
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  background: ${props => props.color};
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 90vh;
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
  padding: 0.5rem;

  &:hover {
    color: #333;
  }
`;

const TaskListWidget = styled.div`
  h3 {
    color: #2c4766;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const TaskItem = styled.li`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #eee;
`;

const TaskTitle = styled.h4`
  margin: 0 0 0.5rem;
  color: #2c4766;
  font-size: 1.1rem;
`;

const TaskContent = styled.p`
  margin: 0 0 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  color: #888;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const TaskFormContainer = styled.div`
  h3 {
    color: #2c4766;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const TaskDetailsContainer = styled.div`
  h3 {
    color: #2c4766;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const DetailGroup = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #555;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

const DetailValue = styled.div`
  color: #333;
  font-size: 1rem;
`;

const DetailContent = styled.div`
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const DetailActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
    font-size: 0.9rem;
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
  line-height: 1.5;

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
  flex: 1;
  text-align: center;

  &:hover {
    background: ${props => props.$active ? '#1a365d' : '#e6e9ed'};
  }
`;

const StatusOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StatusOption = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.$active ? '#2c4766' : '#f0f2f5'};
  color: ${props => props.$active ? 'white' : '#555'};
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '600' : '400'};
  flex: 1;
  text-align: center;

  &:hover {
    background: ${props => props.$active ? '#1a365d' : '#e6e9ed'};
  }
`;

const ErrorText = styled.small`
  color: #ff6b6b;
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #2c4766;
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #888;
  font-style: italic;
`;

export default Dashboard;