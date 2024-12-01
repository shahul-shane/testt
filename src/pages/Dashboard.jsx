import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaSignInAlt, FaUserCircle, FaSignOutAlt, FaFileUpload, FaLayerGroup } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { techTheme, TechButton } from '../components/TechStyles';
import logoImage from '../assets/logo6.png';
import SignInPopup from '../components/SignInPopup';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationPopup from '../components/ConfirmationPopup';
import Navbar from '../components/Navbar';

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
  
  /* Position the tooltip */
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  
  /* Make tooltip visible by default */
  opacity: 1;
  visibility: hidden;
  transition: visibility 0.2s, opacity 0.2s;
`;

const DashboardContainer = styled.div`
  background: ${techTheme.colors.background};
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 10%, rgba(123, 97, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(0, 240, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 3rem;
  position: relative;
  z-index: 1;
`;

const Card = styled(motion.div)`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 20px;
  padding: 2.5rem;
  width: 350px;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  .icon-container {
    width: 70px;
    height: 70px;
    margin: 0 auto 1.5rem;
    background: ${techTheme.colors.gradient.primary};
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: white;
    box-shadow: 0 8px 20px rgba(0, 240, 255, 0.2);
  }
  
  h3 {
    color: ${techTheme.colors.text.primary};
    margin: 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    color: ${techTheme.colors.text.secondary};
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${techTheme.colors.gradient.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover:not(:disabled) {
    transform: translateY(-5px);
    border-color: ${techTheme.colors.primary}40;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }

  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser, signInWithGoogle, logout } = useAuth();
    const [showSignInPopup, setShowSignInPopup] = React.useState(!currentUser);
    const [showSignOutPopup, setShowSignOutPopup] = React.useState(false);

    const handleNavigateToUpload = (type) => {
        navigate('/upload', { state: { processingType: type } });
    };

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            setShowSignInPopup(false);
        } catch (error) {
            console.error("Failed to sign in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
            setShowSignOutPopup(false);
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    return (
        <DashboardContainer>
            <SignInPopup
                isOpen={showSignInPopup}
                onClose={() => setShowSignInPopup(false)}
                onSignIn={handleSignIn}
                isSignedIn={!!currentUser}
            />
            <ConfirmationPopup
                isOpen={showSignOutPopup}
                onClose={() => setShowSignOutPopup(false)}
                onConfirm={handleSignOut}
                title="Are you sure you want to sign out?"
            />
            <Navbar 
                onSignInClick={() => setShowSignInPopup(true)}
                onSignOutClick={() => setShowSignOutPopup(true)}
            />
            <Content>
                <Card
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => handleNavigateToUpload('simple')}
                >
                    <div className="icon-container">
                        <FaFileUpload />
                    </div>
                    <h3>Simple Processing</h3>
                    <p>Upload single advertisement for compliance analysis (Max 2MB)</p>
                </Card>

                <Card
                    disabled={!currentUser}
                    whileHover={{ scale: currentUser ? 1.02 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => currentUser && handleNavigateToUpload('batch')}
                >
                    <div className="icon-container">
                        <FaLayerGroup />
                    </div>
                    <h3>Batch Processing</h3>
                    <p>Process multiple advertisements with advanced options (Premium feature)</p>
                    {!currentUser && (
                        <Tooltip>
                            Please sign in to access batch processing
                        </Tooltip>
                    )}
                </Card>
            </Content>
        </DashboardContainer>
    );
};

export default Dashboard; 