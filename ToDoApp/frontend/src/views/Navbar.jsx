import React from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("connectedUser");
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div
      className="card text-white p-4"
      style={{
        background: 'linear-gradient(135deg, #0ef, #2c4766)',
      }}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <h4 className="card-title mb-0">Welcome </h4>
        <StyledWrapper>
          <button className="btn-logout" onClick={handleLogout}>
            <div className="icon">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9v-62.1h-128c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h128V138c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-53 0-96-43-96-96V128C0 75 43 32 96 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>
            <div className="text">Logout</div>
          </button>
        </StyledWrapper>
      </div>
    </div>
  )
}

const StyledWrapper = styled.div`
  .btn-logout {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #ff3c3c, #ff5e5e);
  }

  .icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .icon svg {
    width: 17px;
  }

  .icon svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0;
    width: 0;
    opacity: 0;
    color: white;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-logout:hover {
    width: 125px;
    border-radius: 40px;
  }

  .btn-logout:hover .icon {
    width: 30%;
    padding-left: 20px;
  }

  .btn-logout:hover .text {
    width: 70%;
    opacity: 1;
    padding-right: 10px;
  }

  .btn-logout:active {
    transform: translate(2px, 2px);
  }
`;

export default Navbar;
