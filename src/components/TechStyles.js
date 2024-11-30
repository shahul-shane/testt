import styled from 'styled-components';
import { Button } from '@mui/material';

export const techTheme = {
  colors: {
    primary: '#00F0FF',      // Cyan
    secondary: '#7B61FF',    // Purple
    accent: '#FF2E63',       // Pink
    success: '#00FF94',      // Neon Green
    warning: '#FFB800',      // Orange
    background: '#0A0A1B',   // Dark Navy
    surface: '#141428',      // Lighter Navy
    surfaceLight: '#1E1E3F', // Highlight Navy
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.85)',
      muted: 'rgba(255, 255, 255, 0.6)'
    },
    border: 'rgba(0, 240, 255, 0.2)',
    gradient: {
      primary: 'linear-gradient(135deg, #00F0FF 0%, #7B61FF 100%)',
      secondary: 'linear-gradient(135deg, #FF2E63 0%, #7B61FF 100%)',
      surface: 'linear-gradient(180deg, rgba(20, 20, 40, 0.8) 0%, rgba(10, 10, 27, 0.8) 100%)'
    }
  },
  shadows: {
    neon: '0 0 20px rgba(0, 240, 255, 0.2)',
    soft: '0 8px 32px rgba(0, 240, 255, 0.1)'
  }
};

export const typography = {
  h1: `
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 800;
    letter-spacing: 2px;
    background: ${techTheme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
  h2: `
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 600;
    letter-spacing: 1px;
    background: ${techTheme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
  h3: `
    font-size: clamp(1.2rem, 2vw, 1.8rem);
    font-weight: 600;
    color: ${techTheme.colors.primary};
  `,
  body: `
    font-size: clamp(1rem, 2vw, 1.4rem);
    line-height: 1.6;
    color: ${techTheme.colors.text.secondary};
  `,
  caption: `
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    color: ${techTheme.colors.text.muted};
  `
};

export const TechContainer = styled.div`
  background: ${techTheme.colors.background};
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 10%, rgba(123, 97, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(0, 240, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const TechCard = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${techTheme.colors.gradient.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${techTheme.shadows.neon};
  }
`;

export const TechButton = styled(Button)`
  && {
    background: ${techTheme.colors.gradient.primary};
    color: ${techTheme.colors.text.primary};
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    text-transform: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${techTheme.shadows.neon};

      &::before {
        left: 100%;
      }
    }

    &:disabled {
      background: ${techTheme.colors.surfaceLight};
      color: ${techTheme.colors.text.muted};
    }
  }
`;

export const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      ${techTheme.colors.primary}10 0%,
      transparent 70%
    );
    pointer-events: none;
    opacity: 0.5;
  }
`;

export const TechMetric = styled.div`
  background: ${techTheme.colors.surfaceLight};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  .metric-title {
    color: ${techTheme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .metric-value {
    color: ${techTheme.colors.primary};
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: ${techTheme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .metric-change {
    font-size: 0.9rem;
    color: ${props => props.trend === 'up' ? techTheme.colors.success : techTheme.colors.accent};
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${techTheme.colors.gradient.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

export const TechNav = styled.div`
  background: ${techTheme.colors.surfaceLight};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .nav-item {
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: ${techTheme.colors.text.secondary};
    position: relative;
    overflow: hidden;

    &.active {
      background: ${techTheme.colors.gradient.primary};
      color: ${techTheme.colors.text.primary};
    }

    &:hover:not(.active) {
      background: ${techTheme.colors.surface};
      &::before {
        transform: scaleX(1);
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: ${techTheme.colors.gradient.primary};
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }
  }
`;

export const TechPageContainer = styled(TechContainer)`
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const TechContentWrapper = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${techTheme.colors.gradient.primary};
  }
`;

export const TechHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${techTheme.colors.border};

  h1 {
    ${typography.h2}
    margin: 0;
  }

  p {
    ${typography.body}
    margin: 0.5rem 0 0;
  }
`;

export const TechTable = styled.div`
  background: ${techTheme.colors.background};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${techTheme.colors.border};

  .MuiTableCell-root {
    color: ${techTheme.colors.text.secondary};
    border-bottom: 1px solid ${techTheme.colors.border};
    padding: 1rem;
  }

  .MuiTableHead-root {
    .MuiTableCell-root {
      background: ${techTheme.colors.surfaceLight};
      color: ${techTheme.colors.primary};
      font-weight: 600;
    }
  }

  .MuiTableRow-root {
    transition: all 0.3s ease;

    &:hover {
      background: ${techTheme.colors.surfaceLight};
    }
  }
`;

export const TechStatus = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  background: ${props => props.status === 'Compliant' 
    ? `${techTheme.colors.success}20` 
    : `${techTheme.colors.accent}20`};
  color: ${props => props.status === 'Compliant' 
    ? techTheme.colors.success 
    : techTheme.colors.accent};
  border: 1px solid ${props => props.status === 'Compliant' 
    ? techTheme.colors.success 
    : techTheme.colors.accent};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TechChart = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;

  h3 {
    color: ${techTheme.colors.primary};
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
  }

  .recharts-cartesian-grid line {
    stroke: ${techTheme.colors.border};
  }

  .recharts-text {
    fill: ${techTheme.colors.text.secondary};
  }
`;

export const TechMetricCard = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  .metric-title {
    color: ${techTheme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    background: ${techTheme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${techTheme.colors.gradient.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

export const TechForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-group {
    background: ${techTheme.colors.surface};
    border: 1px solid ${techTheme.colors.border};
    border-radius: 12px;
    padding: 1.5rem;

    label {
      display: block;
      ${typography.h3}
      margin-bottom: 0.8rem;
    }

    input, textarea, select {
      width: 100%;
      background: ${techTheme.colors.background};
      border: 1px solid ${techTheme.colors.border};
      border-radius: 8px;
      ${typography.body}
      padding: 0.8rem;

      &:focus {
        outline: none;
        border-color: ${techTheme.colors.primary};
      }

      &::placeholder {
        color: ${techTheme.colors.text.muted};
      }
    }
  }
`; 