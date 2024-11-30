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

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const analyzeUpload = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setAnalysisResults({
          overview: {
            score: 85,
            summary: "Overall analysis of 6 images",
            totalIssues: 8,
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
          },
          video: {
            score: 82,
            analysis: "Video content analysis results",
            details: [
              {
                type: "Format",
                status: "Pass",
                details: "Video format is compatible with all platforms"
              },
              {
                type: "Duration",
                status: "Pass",
                details: "Length is within acceptable range"
              }
            ],
            issues: [
              "Add closed captions",
              "Reduce transition speed between scenes"
            ]
          },
          audio: {
            score: 90,
            analysis: "Audio content analysis results",
            details: [
              {
                type: "Quality",
                status: "Pass",
                details: "Audio quality meets platform standards"
              },
              {
                type: "Volume",
                status: "Pass",
                details: "Volume levels are consistent and appropriate"
              }
            ],
            issues: []
          }
        });
      } catch (err) {
        setError("Failed to analyze the upload. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    analyzeUpload();
  }, []);

  if (isLoading) {
    return (
      <TechPageContainer>
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
      </TechPageContainer>
    );
  }

  if (error) {
    return (
      <TechPageContainer>
        <TechContentWrapper>
          <div style={{ textAlign: 'center', color: techTheme.colors.accent }}>
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </TechContentWrapper>
      </TechPageContainer>
    );
  }

  return (
    <TechPageContainer>
      <TechContentWrapper>
        <TechHeader>
          <div>
            <h1>Analysis Report</h1>
            <p>Comprehensive analysis of your advertisement</p>
          </div>
          <ActionButtons>
            <button onClick={() => navigate('/upload')}>
              New Analysis
            </button>
            <button onClick={() => navigate('/')}>
              Back to Home
            </button>
          </ActionButtons>
        </TechHeader>

        <AnalysisSection>
          <TechNav>
            {[
              { id: 'overview', label: 'Overview', desc: 'General analysis' },
              { id: 'images', label: 'Images', desc: 'Image content analysis' },
              { id: 'text', label: 'Text', desc: 'Text content analysis' },
              { id: 'video', label: 'Video', desc: 'Video content analysis' },
              { id: 'audio', label: 'Audio', desc: 'Audio content analysis' }
            ].map(section => (
              <div
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <div>{section.label}</div>
                <small>{section.desc}</small>
              </div>
            ))}
          </TechNav>

          <AnalysisContent>
            {activeSection === 'overview' ? (
              <>
                <ResultCard score={analysisResults.overview.score}>
                  <div className="header">
                    <h4>Overall Analysis</h4>
                    <div className="score">Score: {analysisResults.overview.score}%</div>
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
            ) : (
              <>
                <ResultCard score={analysisResults[activeSection].score}>
                  <div className="header">
                    <h4>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Analysis</h4>
                    <div className="score">Score: {analysisResults[activeSection].score}%</div>
                  </div>
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
                </ResultCard>
              </>
            )}
          </AnalysisContent>
        </AnalysisSection>
      </TechContentWrapper>
    </TechPageContainer>
  );
};

export default Report;
