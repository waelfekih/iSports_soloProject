import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

function GetStarted() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <Wrapper>
      <Card>
        <Title>Welcome to ToDo App</Title>
        <Description>Organize your tasks and boost your productivity.</Description>
        <StartButton onClick={handleClick}>Get Started</StartButton>
      </Card>
    </Wrapper>
  );
}

// Styled Components
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const StartButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default GetStarted;