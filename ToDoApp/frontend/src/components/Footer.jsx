import React from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        © {new Date().getFullYear()} ToDoApp. All rights reserved.
      </FooterContent>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0ef, #2c4766);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const FooterContent = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export default Footer;