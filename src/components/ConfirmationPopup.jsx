import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  padding: 2rem;
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

const Title = styled.h2`
  color: ${techTheme.colors.text.primary};
  margin: 0 0 1rem;
  font-size: 1.5rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, title }) => {
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
            <Title>{title}</Title>
            <ButtonContainer>
              <TechButton
                onClick={onClose}
                style={{ 
                  background: techTheme.colors.surfaceLight,
                  color: techTheme.colors.text.primary 
                }}
              >
                Cancel
              </TechButton>
              <TechButton
                variant="contained"
                onClick={onConfirm}
                style={{ background: techTheme.colors.accent }}
              >
                Sign Out
              </TechButton>
            </ButtonContainer>
          </PopupContent>
        </PopupOverlay>
      )}
    </AnimatePresence>
  );
};

ConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ConfirmationPopup; 