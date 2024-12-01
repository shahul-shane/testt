import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaSignInAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { techTheme, TechButton } from './TechStyles';
import logoImage from '../assets/logo6.png';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${techTheme.colors.surface}CC;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${techTheme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const NavLogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  img {
    height: 200px;
    width: auto;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled(TechButton)`
  && {
    position: relative;
    min-width: unset;
    width: 45px;
    height: 45px;
    padding: 0;
    border-radius: 12px;
    opacity: ${props => props.disabled ? 0.5 : 1};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 240, 255, 0.2);
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background: ${techTheme.colors.surface};
  color: ${techTheme.colors.text.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid ${techTheme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  visibility: hidden;
  transition: visibility 0.2s, opacity 0.2s;

  ${IconButton}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  background: ${techTheme.colors.surfaceLight};
  border-radius: 12px;
  cursor: default;
  transition: all 0.3s ease;
`;

const UserName = styled.span`
  color: ${techTheme.colors.text.primary};
  font-size: 0.9rem;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Navbar = ({ onSignOutClick }) => {
  const navigate = useNavigate();
  const { currentUser, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <NavbarContainer>
      <NavLogoContainer>
        <img src={logoImage} alt="ADRULE-AI Logo" />
      </NavLogoContainer>
      <NavActions>
        {currentUser && (
          <UserInfo>
            <FaUserCircle size={20} />
            <UserName>
              {currentUser.displayName || currentUser.email}
            </UserName>
          </UserInfo>
        )}

        <IconButton
          disabled={!currentUser}
          title={currentUser ? "History" : ""}
          onClick={() => currentUser && navigate('/history')}
        >
          <FaHistory />
          {!currentUser && (
            <Tooltip>Please sign in to access history</Tooltip>
          )}
        </IconButton>

        {currentUser ? (
          <IconButton onClick={onSignOutClick} title="Sign Out">
            <FaSignOutAlt />
          </IconButton>
        ) : (
          <TechButton variant="contained" onClick={handleSignIn}>
            <FaSignInAlt style={{ marginRight: '8px' }} />
            Sign In
          </TechButton>
        )}
      </NavActions>
    </NavbarContainer>
  );
};

export default Navbar; 