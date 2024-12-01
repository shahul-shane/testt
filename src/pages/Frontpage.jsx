import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCog, FaRobot, FaMagic, FaRocket } from 'react-icons/fa';
import { techTheme, TechButton, TechContainer } from '../components/TechStyles';
import logoImage from '../assets/logo6.png';

const HeroSection = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const LogoImage = styled.img`
  width: 220px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 25px ${techTheme.colors.primary}60);
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  transform-origin: center;

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 30px ${techTheme.colors.secondary}70);
  }
`;

const GlowingRing = styled(motion.div)`
  position: absolute;
  width: 280px;
  height: 240px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background: conic-gradient(
    from 0deg,
    ${techTheme.colors.primary}20,
    ${techTheme.colors.secondary}20,
    ${techTheme.colors.primary}20
  );
  filter: blur(15px);
  z-index: 1;
  animation: rotate 10s linear infinite;

  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      ${techTheme.colors.primary}40,
      transparent,
      ${techTheme.colors.secondary}40
    );
    animation: pulse 3s ease-in-out infinite;
  }
`;

const TechDecoration = styled.div`
  position: absolute;
  inset: -20px;
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${techTheme.colors.gradient.primary};
    opacity: 0.1;
  }

  &::before {
    width: 40px;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  &::after {
    width: 2px;
    height: 40px;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
`;

const LogoWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  position: relative;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle at center,
      ${techTheme.colors.primary}20 0%,
      ${techTheme.colors.secondary}15 40%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(50px);
    z-index: 0;
    animation: pulse 4s ease-in-out infinite alternate;
  }
`;

const LogoText = styled.div`
  padding: 1rem 3rem;
  position: relative;

  h1 {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
`;

const Description = styled(motion.div)`
  max-width: 800px;
  width: 90%;
  margin-bottom: 5vh;
  color: ${techTheme.colors.text.secondary};
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1.6;
  position: relative;
  padding: 0 2rem;
`;

const Features = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 90%;
  max-width: 1400px;
  margin: 8vh auto 8vh;
  padding: 0 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-color: ${techTheme.colors.primary}40;
  }

  .icon {
    font-size: 2rem;
    color: ${techTheme.colors.primary};
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  h3 {
    color: ${techTheme.colors.text.primary};
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    font-weight: 600;
  }

  p {
    color: ${techTheme.colors.text.secondary};
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${techTheme.colors.gradient.primary};
    opacity: 0.5;
  }
`;

const GlowingOrb = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 40vw;
  max-width: 600px;
  max-height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    ${techTheme.colors.primary}20 0%,
    transparent 70%
  );
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
`;

const TryNowContainer = styled(motion.div)`
  margin: 2vh 0 6vh;
  
  ${TechButton} {
    font-size: clamp(1rem, 1.5vw, 1.4rem);
    padding: clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 4rem);
    letter-spacing: 1px;
  }
`;

const FullScreenContainer = styled(TechContainer)`
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 80px 0 4rem 0;
  overflow-x: hidden;
`;

const Navbar = styled.nav`
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
`;

const NavLogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 200px;
    width: auto;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
    
    span.adrule {
      background: linear-gradient(
        135deg,
        ${techTheme.colors.primary},
        ${techTheme.colors.secondary}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
      font-weight: 800;
    }

    span.ai {
      background: ${techTheme.colors.gradient.primary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 0.2rem 0.8rem;
      font-weight: 800;
    }
  }
`;

const Frontpage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar>
        <NavLogoContainer>
          <img src={logoImage} alt="ADRULE-AI Logo" />
        </NavLogoContainer>
        <TechButton
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          <FaRocket style={{ marginRight: '8px' }} /> Get Started
        </TechButton>
      </Navbar>
      <FullScreenContainer>
        <HeroSection>
          <LogoWrapper> 
            <LogoText>
              <h1>
                Simplify Your Ad Compliance <br /> Checks with ADRULE AI
              </h1>
            </LogoText>
          </LogoWrapper>
          <Description
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Advanced AI-powered platform for comprehensive ad analysis and compliance checking.
            Ensure your advertisements meet platform guidelines with our cutting-edge technology.
          </Description>
          <TryNowContainer
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <TechButton
            variant="contained"
            onClick={() => navigate('/dashboard')}
          >
            <FaRocket style={{ marginRight: '12px' }} /> Start Your Analysis
          </TechButton>
        </TryNowContainer>
          <Features>
            {[
              {
                title: "Multi-Platform Analysis",
                description: "Analyze ads across multiple social media platforms with a single click",
                icon: <FaCheckCircle className="icon" />
              },
              {
                title: "Real-time Compliance",
                description: "Instant feedback on ad compliance with platform-specific guidelines",
                icon: <FaCog className="icon" />
              },
              {
                title: "AI-Powered Insights",
                description: "Advanced AI analysis of images, text, video, and audio content",
                icon: <FaRobot className="icon" />
              },
              {
                title: "Automated Fixes",
                description: "Smart suggestions and automated fixes for non-compliant content",
                icon: <FaMagic className="icon" />
              }
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: "easeOut" }}
              >
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </Features>
        </HeroSection>
      </FullScreenContainer>
    </>
  );
};

export default Frontpage;
