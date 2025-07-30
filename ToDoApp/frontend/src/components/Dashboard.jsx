import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from '../views/Navbar';

const Dashboard = () => {
  const [activeWidget, setActiveWidget] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const navigate = useNavigate();

  // Sample task data
  const taskData = {
    progress: ['Fix login page', 'Update user dashboard'],
    completed: ['Design logo', 'Setup database'],
    tostart: ['Write documentation', 'Test mobile view']
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <Navbar />
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
          🍩 Tasks in Progress
        </ActionButton>

        <ActionButton 
          onClick={() => setActiveWidget('completed')}
          color="#7bd389"
        >
          🌱 Completed Tasks
        </ActionButton>

        <ActionButton 
          onClick={() => setActiveWidget('tostart')}
          color="#ec7e7f"
        >
          ☕ Tasks to Start
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
              <CreateTaskWidget onClose={() => setActiveWidget(null)} />
            ) : (
              <TaskListWidget>
                <h3>{activeWidget === 'progress' ? 'In Progress' : 
                     activeWidget === 'completed' ? 'Completed' : 'To Start'} Tasks</h3>
                <ul>
                  {taskData[activeWidget].map((task, index) => (
                    <TaskItem key={index}>{task}</TaskItem>
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
const CreateTaskWidget = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    // Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }
    
    // Due date validation
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(dueDate) < new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status: "To Start"
    };

    // Here you would make your API call
    console.log("Submitting task:", taskData);
    
    // Simulate successful submission
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setErrors({});
    }, 1500);
  };

  return (
    <TaskFormContainer>
      <h3>Create New Task</h3>
      {success ? (
        <SuccessMessage>✅ Task created successfully!</SuccessMessage>
      ) : (
        <form onSubmit={handleSubmit}>
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
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
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