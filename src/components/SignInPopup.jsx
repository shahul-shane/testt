import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGoogle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { techTheme, TechButton } from './TechStyles';

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const PopupContent = styled(motion.div)`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 24px;
  padding: 2.5rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${techTheme.colors.gradient.primary};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${techTheme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;

  &:hover {
    color: ${techTheme.colors.text.primary};
    background: ${techTheme.colors.surfaceLight};
  }
`;

const Title = styled.h2`
  color: ${techTheme.colors.text.primary};
  margin: 0 0 1rem;
  font-size: 1.8rem;
  text-align: center;
`;

const Description = styled.p`
  color: ${techTheme.colors.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const SignInButton = styled(TechButton)`
  && {
    width: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.1rem;
    border-radius: 12px;
    background: #fff;
    color: #000;
    border: 1px solid #ddd;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: ${techTheme.colors.text.secondary};
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: underline;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    color: ${techTheme.colors.text.primary};
  }
`;

const SignInPopup = ({ isOpen, onClose, onSignIn, isSignedIn }) => {
  if (isSignedIn) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <PopupOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <PopupContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FaTimes size={20} />
            </CloseButton>
            
            <Title>Welcome to ADRULE AI</Title>
            <Description>
              Sign in with Google to unlock premium features including ad history tracking, 
              batch processing, and advanced analytics for your advertisements.
            </Description>

            <ButtonContainer>
              <SignInButton onClick={onSignIn}>
                <FaGoogle /> Continue with Google
              </SignInButton>
              <SkipButton onClick={onClose}>
                Skip sign in for now
              </SkipButton>
            </ButtonContainer>
          </PopupContent>
        </PopupOverlay>
      )}
    </AnimatePresence>
  );
};

SignInPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
};

export default SignInPopup; 