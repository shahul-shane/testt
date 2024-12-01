import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import {
  TechPageContainer,
  TechContentWrapper,
  TechHeader,
  TechNav,
  techTheme,
  typography
} from '../components/TechStyles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Navbar from '../components/Navbar';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaDownload, FaFileArchive, FaHome, FaImages, FaFont, FaVideo, FaVolumeUp } from 'react-icons/fa';

const AnalysisSection = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisContent = styled.div`
  background: ${techTheme.colors.surface};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${techTheme.colors.border};

  h3 {
    ${typography.h3}
    margin-bottom: 1.5rem;
  }
`;

const ResultCard = styled.div`
  background: ${techTheme.colors.surfaceLight};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h4 {
      color: ${techTheme.colors.primary};
      margin: 0;
    }

    .score {
      background: ${props => props.score >= 90
    ? techTheme.colors.success + '20'
    : props.score >= 70
      ? techTheme.colors.warning + '20'
      : techTheme.colors.accent + '20'};
      color: ${props => props.score >= 90
    ? techTheme.colors.success
    : props.score >= 70
      ? techTheme.colors.warning
      : techTheme.colors.accent};
      padding: 0.4rem 1rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
        font-size: 1.2rem;
    }
  }

  .content {
    color: ${techTheme.colors.text.secondary};
    line-height: 1.6;
  }

  .issues {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${techTheme.colors.border};

    h5 {
      color: ${techTheme.colors.primary};
      margin: 0 0 0.5rem 0;
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
      color: ${techTheme.colors.text.secondary};

      li {
        margin-bottom: 0.5rem;
      }
    }
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .detail-item {
    background: ${techTheme.colors.background};
    padding: 1rem;
    border-radius: 4px;
    border-left: 3px solid ${techTheme.colors.primary};

    .detail-type {
      color: ${techTheme.colors.primary};
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .detail-status {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      background: ${props => props.status === 'Pass'
    ? techTheme.colors.success + '20'
    : techTheme.colors.warning + '20'};
      color: ${props => props.status === 'Pass'
    ? techTheme.colors.success
    : techTheme.colors.warning};
    }

    .detail-info {
      color: ${techTheme.colors.text.secondary};
      font-size: 0.9rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  button {
    background: ${techTheme.colors.surface};
    border: 1px solid ${techTheme.colors.border};
    color: ${techTheme.colors.text.primary};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: ${techTheme.colors.surfaceLight};
      border-color: ${techTheme.colors.primary};
    }
  }

  .status-icon {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: ${props => props.status === 'processing'
    ? techTheme.colors.primary + '20'
    : props.status === 'failed'
      ? techTheme.colors.error + '20'
      : techTheme.colors.success + '20'};
    
    svg {
      margin-right: 0.5rem;
      font-size: 1.2rem;
      color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
    }

    span {
      color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
      font-weight: 500;
    }
  }
`;

const StyledTable = styled(TableContainer)`
  margin-top: 2rem;
  background: ${techTheme.colors.surface} !important;
  border: 1px solid ${techTheme.colors.border};
  border-radius: 12px !important;
  overflow: hidden;

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
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: ${techTheme.colors.surfaceLight};
    }
  }
`;

const ScoreCell = styled.div`
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  background: ${props => props.score >= 90
    ? techTheme.colors.success + '20'
    : props.score >= 70
      ? techTheme.colors.warning + '20'
      : techTheme.colors.accent + '20'};
  color: ${props => props.score >= 90
    ? techTheme.colors.success
    : props.score >= 70
      ? techTheme.colors.warning
      : techTheme.colors.accent};
  display: inline-block;
`;

const GraphSection = styled.div`
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GraphCard = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;

  h4 {
    color: ${techTheme.colors.primary};
    margin: 0 0 1.5rem 0;
  }
`;

const ImageDetailView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ImageDetailCard = styled.div`
  background: ${techTheme.colors.surface};
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
  border: 1px solid ${techTheme.colors.border};

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: ${techTheme.colors.text.primary};
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.5rem;

    &:hover {
      color: ${techTheme.colors.primary};
    }
  }

  .image-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
`;

const BackButtonIcon = styled(FaArrowLeft)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${techTheme.colors.primary};
  margin-right: 1rem;
`;

const COLORS = [
  '#00F0FF',  // Primary
  '#7B61FF',  // Secondary
  '#FF2E63',  // Accent
  '#00FF94'   // Success
];

const pieData = [
  { name: 'No Issues', value: 2 },
  { name: 'Minor Issues', value: 3 },
  { name: 'Major Issues', value: 1 }
];

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .score-status {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .status-icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
    font-size: 0.9rem;

    svg {
      font-size: 1.2rem;
    }
  }
`;

const BatchProgressSection = styled.div`
  background: ${techTheme.colors.surfaceLight};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const BatchProgress = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const BatchStat = styled.div`
  background: ${techTheme.colors.surface};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${techTheme.colors.border};

  .label {
    color: ${techTheme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .value {
    color: ${techTheme.colors.primary};
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

const CancelButton = styled.button`
  background: #FF3B3B;
  color: white;
  border: 1px solid #FF3B3B;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    background: #E63535;
    border-color: #E63535;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  background: ${props => props.variant === 'primary' ? techTheme.colors.primary : techTheme.colors.surface};
  color: ${props => props.variant === 'primary' ? 'white' : techTheme.colors.text.primary};
  border: 1px solid ${props => props.variant === 'primary' ? techTheme.colors.primary : techTheme.colors.border};

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    background: ${props => props.variant === 'primary' ?
    `${techTheme.colors.primary}dd` :
    techTheme.colors.surfaceLight};
    border-color: ${props => props.variant === 'primary' ?
    techTheme.colors.primary :
    techTheme.colors.primary};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      background: ${props => props.variant === 'primary' ? techTheme.colors.primary : techTheme.colors.surface};
      border-color: ${props => props.variant === 'primary' ? techTheme.colors.primary : techTheme.colors.border};
    }
  }
`;

const HeaderStatusIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  background: ${props => props.status === 'processing'
    ? techTheme.colors.primary + '20'
    : props.status === 'failed'
      ? techTheme.colors.error + '20'
      : techTheme.colors.success + '20'};

  svg {
    font-size: 1.1rem;
    color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
  }

  span {
    color: ${props => props.status === 'processing'
    ? techTheme.colors.primary
    : props.status === 'failed'
      ? techTheme.colors.error
      : techTheme.colors.success};
    font-weight: 500;
  }
`;

const ImageDetails = ({ image, onClose }) => {
  const imagePieData = [
    { name: 'Score', value: image.score },
    { name: 'Gap', value: 100 - image.score }
  ];

  const imageColors = [techTheme.colors.primary, techTheme.colors.border];

  return (
    <ImageDetailView>
      <ImageDetailCard>
        <button className="close-button" onClick={onClose}>×</button>

        <h2 style={{ color: techTheme.colors.primary }}>{image.name}</h2>
        <p style={{ color: techTheme.colors.text.secondary }}>{image.analysis}</p>

        <div className="image-stats">
          <GraphCard>
            <h4>Compliance Score</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={imagePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {imagePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={imageColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GraphCard>

          <ResultCard score={image.score}>
            <div className="header">
              <h4>Details</h4>
              <div className="score">Score: {image.score}%</div>
            </div>
            <div className="content">
              <p><strong>Size:</strong> {image.size}</p>
              <p><strong>Compliance:</strong> {image.compliance}</p>
            </div>
            {image.issues.length > 0 && (
              <div className="issues">
                <h5>Issues to Address:</h5>
                <ul>
                  {image.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </ResultCard>
        </div>
      </ImageDetailCard>
    </ImageDetailView>
  );
};

const GlobalStyle = styled.div`
  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .fa-spin {
    animation: fa-spin 2s infinite linear;
  }
`;

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBatchUpload, setIsBatchUpload] = useState(false);
  const [batchProgress, setBatchProgress] = useState({
    total: 0,
    completed: 0,
    current: 0,
    remaining: 0
  });

  const handleSignOut = async () => {
    try {
      await logout();
      setShowSignOutPopup(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  useEffect(() => {
    const analyzeUpload = async () => {
      try {
        // Check if it's a batch upload from location state
        const isBatch = location.state?.isBatch || false;
        // const isBatch = true;
        setIsBatchUpload(isBatch);

        if (isBatch) {
          // Set initial batch progress
          setBatchProgress({
            total: location.state?.totalFiles || 10,
            completed: 0,
            current: 1,
            remaining: location.state?.totalFiles - 1 || 9
          });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        setAnalysisResults({
          overview: {
            score: isBatch ? null : 85, // No score during batch processing
            summary: isBatch
              ? "Processing batch upload of multiple advertisements"
              : "Overall analysis of advertisement",
            totalIssues: 8,
            status: isBatch ? "processing" : "completed",
            images: [
              {
                id: 1,
                name: "banner_main.jpg",
                score: 95,
                size: "1200x628",
                issues: [],
                analysis: "Excellent image quality and composition",
                compliance: "Fully compliant"
              },
              {
                id: 2,
                name: "product_showcase.jpg",
                score: 88,
                size: "800x800",
                issues: ["Missing alt text"],
                analysis: "Good product visibility",
                compliance: "Minor issues"
              },
              {
                id: 3,
                name: "lifestyle_shot.jpg",
                score: 75,
                size: "1080x1080",
                issues: ["Contrast ratio below requirement", "Text too small"],
                analysis: "Lifestyle context is good but technical issues present",
                compliance: "Needs attention"
              },
              {
                id: 4,
                name: "mobile_banner.jpg",
                score: 92,
                size: "600x900",
                issues: [],
                analysis: "Well optimized for mobile",
                compliance: "Fully compliant"
              },
              {
                id: 5,
                name: "promo_card.jpg",
                score: 68,
                size: "1200x628",
                issues: ["Missing disclaimer", "Price tag not clear"],
                analysis: "Promotional content needs revision",
                compliance: "Non-compliant"
              },
              {
                id: 6,
                name: "social_share.jpg",
                score: 85,
                size: "1200x630",
                issues: ["Text contrast could be improved"],
                analysis: "Good social media optimization",
                compliance: "Minor issues"
              }
            ]
          },
          images: {
            score: 88,
            analysis: "Image analysis across all uploaded content",
            details: [
              {
                type: "Resolution Check",
                status: "Pass",
                details: "All images meet minimum resolution requirements"
              },
              {
                type: "Aspect Ratio",
                status: "Warning",
                details: "Some images need adjustment for platform-specific ratios"
              },
              {
                type: "Color Profile",
                status: "Pass",
                details: "All images use correct color space (sRGB)"
              }
            ],
            issues: [
              "2 images need aspect ratio adjustment",
              "1 image has low contrast text",
              "Missing alt text in some images"
            ]
          },
          text: {
            score: 85,
            analysis: "Text content analysis results",
            details: [
              {
                type: "Grammar & Spelling",
                status: "Pass",
                details: "No significant errors found"
              },
              {
                type: "Compliance",
                status: "Warning",
                details: "Missing required disclaimers"
              }
            ],
            issues: [
              "Add required disclaimers",
              "Improve text contrast in promotional images"
            ]
          }
        });

        setIsLoading(false);

        // Simulate batch processing progress
        if (isBatch) {
          const interval = setInterval(() => {
            setBatchProgress(prev => {
              if (prev.completed >= prev.total - 1) {
                clearInterval(interval);
                setAnalysisResults(current => ({
                  ...current,
                  overview: {
                    ...current.overview,
                    status: "completed",
                    score: 82
                  }
                }));
                return prev;
              }
              return {
                ...prev,
                completed: prev.completed + 1,
                current: prev.current + 1,
                remaining: prev.remaining - 1
              };
            });
          }, 2000);
        }
      } catch (err) {
        setError("Failed to analyze the upload. Please try again.");
      }
    };

    analyzeUpload();
  }, [location.state]);

  const handleCancelProcessing = () => {
    // Add logic to cancel batch processing
    if (window.confirm('Are you sure you want to cancel the batch processing?')) {
      navigate('/upload');
    }
  };

  // Add this section before the AnalysisSection in your JSX
  const renderBatchProgress = () => {
    if (!isBatchUpload || analysisResults?.overview.status === 'completed') return null;

    return (
      <BatchProgressSection>
        <h3>Batch Processing Status</h3>
        <BatchProgress>
          <BatchStat>
            <div className="label">Total Files</div>
            <div className="value">{batchProgress.total}</div>
          </BatchStat>
          <BatchStat>
            <div className="label">Completed</div>
            <div className="value">{batchProgress.completed}</div>
          </BatchStat>
          <BatchStat>
            <div className="label">Current</div>
            <div className="value">{batchProgress.current}</div>
          </BatchStat>
          <BatchStat>
            <div className="label">Remaining</div>
            <div className="value">{batchProgress.remaining}</div>
          </BatchStat>
        </BatchProgress>
        <CancelButton onClick={handleCancelProcessing}>
          <FaTimesCircle />
          <span>Cancel Processing</span>
        </CancelButton>
      </BatchProgressSection>
    );
  };

  const handleDownloadReport = () => {
    // Implement report download logic
    console.log('Downloading report...');
  };

  const handleDownloadZip = () => {
    // Implement ZIP download logic
    console.log('Downloading ZIP file...');
  };

  if (isLoading) {
    return (
      <GlobalStyle>
        <TechPageContainer>
          <Navbar onSignOutClick={() => setShowSignOutPopup(true)} />
          <TechContentWrapper>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <CircularProgress style={{ color: techTheme.colors.primary }} />
              <p style={{ color: techTheme.colors.text.secondary }}>
                Analyzing your advertisement...
              </p>
            </div>
          </TechContentWrapper>
          <ConfirmationPopup
            isOpen={showSignOutPopup}
            onClose={() => setShowSignOutPopup(false)}
            onConfirm={handleSignOut}
            title="Are you sure you want to sign out?"
          />
        </TechPageContainer>
      </GlobalStyle>
    );
  }

  if (error) {
    return (
      <GlobalStyle>
        <TechPageContainer>
          <Navbar onSignOutClick={() => setShowSignOutPopup(true)} />
          <TechContentWrapper>
            <div style={{ textAlign: 'center', color: techTheme.colors.accent }}>
              <h2>Error</h2>
              <p>{error}</p>
            </div>
          </TechContentWrapper>
          <ConfirmationPopup
            isOpen={showSignOutPopup}
            onClose={() => setShowSignOutPopup(false)}
            onConfirm={handleSignOut}
            title="Are you sure you want to sign out?"
          />
        </TechPageContainer>
      </GlobalStyle>
    );
  }

  return (
    <GlobalStyle>
      <TechPageContainer>
        <Navbar onSignOutClick={() => setShowSignOutPopup(true)} />
        <TechContentWrapper>
          <TechHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BackButtonIcon onClick={() => navigate('/dashboard')} />
              <div>
                <h1>Ad Analysis Against Platform Policies</h1>
              </div>
            </div>
            <HeaderButtons>
              <HeaderStatusIcon status={analysisResults.overview.status}>
                {analysisResults.overview.status === 'processing' ? (
                  <>
                    <FaSpinner className="fa-spin" />
                    <span>Processing</span>
                  </>
                ) : analysisResults.overview.status === 'failed' ? (
                  <>
                    <FaExclamationCircle />
                    <span>Failed</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Completed</span>
                  </>
                )}
              </HeaderStatusIcon>
              <ActionButton
                onClick={handleDownloadReport}
                disabled={analysisResults.overview.status === 'processing'}
              >
                <FaDownload />
                <span>Download Report</span>
              </ActionButton>
              <ActionButton
                onClick={handleDownloadZip}
                disabled={analysisResults.overview.status === 'processing'}
              >
                <FaFileArchive />
                <span>Download Files</span>
              </ActionButton>
            </HeaderButtons>
          </TechHeader>

          {renderBatchProgress()}

          {/* Only show analysis section if not batch processing or if batch processing is completed */}
          {(!isBatchUpload || analysisResults.overview.status === 'completed') && (
            <AnalysisSection>
              <TechNav>
                {[
                  { 
                    id: 'overview', 
                    label: 'Overview',
                    desc: 'General analysis',
                    icon: <FaHome />
                  },
                  { 
                    id: 'images', 
                    label: 'Images',
                    desc: 'Image content analysis',
                    icon: <FaImages />
                  },
                  { 
                    id: 'text', 
                    label: 'Text',
                    desc: 'Text content analysis',
                    icon: <FaFont />
                  },
                  { 
                    id: 'video', 
                    label: 'Video',
                    desc: 'Video content analysis',
                    icon: <FaVideo />
                  },
                  { 
                    id: 'audio', 
                    label: 'Audio',
                    desc: 'Audio content analysis',
                    icon: <FaVolumeUp />
                  }
                ].map(section => (
                  <div
                    key={section.id}
                    className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="nav-content">
                      {/* <div className="nav-icon">{section.icon}</div> */}
                      <div className="nav-label">{section.label}</div>
                      <div className="nav-desc">{section.desc}</div>
                    </div>
                  </div>
                ))}
              </TechNav>

              <AnalysisContent>
                {activeSection === 'overview' ? (
                  <>
                    <ResultCard score={analysisResults.overview.score} status={analysisResults.overview.status}>
                      <div className="header">
                        <h4>Overall Analysis</h4>
                        <StatusIndicator status={analysisResults.overview.status}>
                          <div className="score-status">
                            <div className="score">Score: {analysisResults.overview.score}%</div>
                          </div>
                        </StatusIndicator>
                      </div>
                      <div className="content">
                        {analysisResults.overview.summary}
                      </div>
                    </ResultCard>

                    <GraphSection>
                      <GraphCard>
                        <h4>Compliance Scores by Image</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analysisResults.overview.images}>
                            <CartesianGrid strokeDasharray="3 3" stroke={techTheme.colors.border} />
                            <XAxis
                              dataKey="name"
                              stroke={techTheme.colors.text.secondary}
                              tick={{ fill: techTheme.colors.text.secondary }}
                            />
                            <YAxis
                              stroke={techTheme.colors.text.secondary}
                              tick={{ fill: techTheme.colors.text.secondary }}
                            />
                            <Tooltip
                              contentStyle={{
                                background: techTheme.colors.surface,
                                border: `1px solid ${techTheme.colors.border}`,
                                borderRadius: '4px'
                              }}
                            />
                            <Bar dataKey="score" fill={techTheme.colors.primary} />
                          </BarChart>
                        </ResponsiveContainer>
                      </GraphCard>

                      <GraphCard>
                        <h4>Issues Distribution</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'No Issues', value: analysisResults.overview.images.filter(img => img.issues.length === 0).length },
                                { name: 'Minor Issues', value: analysisResults.overview.images.filter(img => img.issues.length === 1).length },
                                { name: 'Major Issues', value: analysisResults.overview.images.filter(img => img.issues.length > 1).length }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill={techTheme.colors.primary}
                              label
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </GraphCard>
                    </GraphSection>

                    <StyledTable component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image Name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Compliance</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Issues</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {analysisResults.overview.images.map((image) => (
                            <TableRow
                              key={image.id}
                              onClick={() => setSelectedImage(selectedImage?.id === image.id ? null : image)}
                            >
                              <TableCell>{image.name}</TableCell>
                              <TableCell>{image.size}</TableCell>
                              <TableCell>{image.compliance}</TableCell>
                              <TableCell>
                                <ScoreCell score={image.score}>{image.score}%</ScoreCell>
                              </TableCell>
                              <TableCell>
                                {image.issues.length === 0 ? (
                                  <span style={{ color: techTheme.colors.success }}>No issues</span>
                                ) : (
                                  `${image.issues.length} issue${image.issues.length > 1 ? 's' : ''}`
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </StyledTable>

                    {selectedImage && <ImageDetails image={selectedImage} onClose={() => setSelectedImage(null)} />}
                  </>
                ) : activeSection === 'video' || activeSection === 'audio' ? (
                  // Show message for video/audio sections if no data
                  <ResultCard>
                    <div className="header">
                      <h4>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Analysis</h4>
                    </div>
                    <div className="content" style={{ textAlign: 'center', padding: '2rem' }}>
                      <FaExclamationCircle
                        style={{
                          fontSize: '2rem',
                          color: techTheme.colors.text.secondary,
                          marginBottom: '1rem'
                        }}
                      />
                      <p>No {activeSection} content detected in this advertisement.</p>
                    </div>
                  </ResultCard>
                ) : (
                  // ... existing code for other sections (images, text) ...
                  <ResultCard score={analysisResults[activeSection]?.score}>
                    <div className="header">
                      <h4>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Analysis</h4>
                      {analysisResults[activeSection] && (
                        <div className="score">Score: {analysisResults[activeSection].score}%</div>
                      )}
                    </div>
                    {analysisResults[activeSection] ? (
                      <>
                        <div className="content">
                          {analysisResults[activeSection].analysis}
                        </div>

                        {analysisResults[activeSection].details && (
                          <div className="details-grid">
                            {analysisResults[activeSection].details.map((detail, index) => (
                              <div key={index} className="detail-item">
                                <div className="detail-type">{detail.type}</div>
                                <div className="detail-status">{detail.status}</div>
                                <div className="detail-info">{detail.details}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {analysisResults[activeSection].issues?.length > 0 && (
                          <div className="issues">
                            <h5>Issues to Address:</h5>
                            <ul>
                              {analysisResults[activeSection].issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="content" style={{ textAlign: 'center', padding: '2rem' }}>
                        <FaExclamationCircle
                          style={{
                            fontSize: '2rem',
                            color: techTheme.colors.text.secondary,
                            marginBottom: '1rem'
                          }}
                        />
                        <p>No {activeSection} content available for analysis.</p>
                      </div>
                    )}
                  </ResultCard>
                )}
              </AnalysisContent>
            </AnalysisSection>
          )}

          <ConfirmationPopup
            isOpen={showSignOutPopup}
            onClose={() => setShowSignOutPopup(false)}
            onConfirm={handleSignOut}
            title="Are you sure you want to sign out?"
          />
        </TechContentWrapper>
      </TechPageContainer>
    </GlobalStyle>
  );
};

export default Report;
