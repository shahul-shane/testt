import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button, CircularProgress, LinearProgress, Select,
  MenuItem, FormControl, Checkbox, FormControlLabel,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Navbar from '../components/Navbar';
import {
  TechPageContainer,
  TechContentWrapper,
  TechHeader,
  typography,
  techTheme
} from '../components/TechStyles';
import { FaArrowLeft, FaAd } from 'react-icons/fa';
import { uploadAd } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UploadSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  h3 {
    ${typography.h3}
    margin-bottom: 1.5rem;
  }
`;

const DropzoneArea = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#66c0f4' : '#375470'};
  border-radius: 4px;
  background: ${props => props.isDragActive ? 'rgba(102, 192, 244, 0.1)' : '#1b2838'};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #66c0f4;
    background: rgba(102, 192, 244, 0.1);
  }

  .icon {
    color: #66c0f4;
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  p {
    color: #c7d5e0;
    margin: 0.5rem 0;
  }

  .file-types {
    color: #8f98a0;
    font-size: 0.9rem;
  }
`;

const TextInputArea = styled.div`
  background: #1b2838;
  border-radius: 4px;
  padding: 1.5rem;

  h3 {
    color: #66c0f4;
    margin: 0 0 1rem 0;
  }

  textarea {
    width: 100%;
    height: 200px;
    background: #2a475e;
    border: 1px solid #375470;
    border-radius: 3px;
    color: #c7d5e0;
    padding: 1rem;
    font-size: 1rem;
    resize: vertical;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #66c0f4;
    }

    &::placeholder {
      color: #8f98a0;
    }
  }
`;

const UploadStatus = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.success ? 'rgba(66, 174, 94, 0.2)' : props.error ? 'rgba(171, 50, 50, 0.2)' : 'transparent'};
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.success ? '#66c0f4' : '#ff6b6b'};

  .status-icon {
    font-size: 1.5rem;
  }
`;

const ProgressWrapper = styled.div`
  margin-top: 1rem;
  
  .MuiLinearProgress-root {
    background: #375470;
    border-radius: 3px;
    height: 8px;
  }

  .MuiLinearProgress-bar {
    background: #66c0f4;
  }
`;

const StyledButton = styled(Button)`
  && {
    background: #66c0f4;
    color: #1b2838;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    margin-top: 1rem;
    width: 100%;
    transition: all 0.2s ease;

    &:hover {
      background: #1999ff;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #375470;
      color: #8f98a0;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InputBox = styled.div`

  label {
    display: block;
    color: #66c0f4;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  input, textarea {
    width: 95%;
    background: #1b2838;
    border: 1px solid #375470;
    border-radius: 2px;
    color: #c7d5e0;
    padding: 0.8rem;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #66c0f4;
    }

    &::placeholder {
      color: #8f98a0;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }

  .MuiSelect-select {
    background: #1b2838 !important;
    color: #c7d5e0 !important;
    border: 1px solid #375470 !important;
    padding: 0.8rem !important;
    font-size: 1rem !important;

    &:focus {
      border-color: #66c0f4 !important;
    }
  }

  .MuiSelect-icon {
    color: #66c0f4 !important;
  }

  .MuiMenu-paper {
    background: #1b2838 !important;
    color: #c7d5e0 !important;
    border: 1px solid #375470 !important;
  }

  .MuiMenuItem-root {
    color: #c7d5e0 !important;
    
    &:hover {
      background: #2a475e !important;
    }

    &.Mui-selected {
      background: #66c0f4 !important;
      color: #1b2838 !important;
    }
  }
`;

const COMPANY_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Retail',
  'Financial Services',
  'Education',
  'Entertainment',
  'Food & Beverage',
  'Travel & Tourism',
  'Real Estate',
  'Manufacturing',
  'Automotive',
  'Energy & Utilities'
];

const ProcessingTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProcessingTypeButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid ${props => props.selected ? '#66c0f4' : '#375470'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(102, 192, 244, 0.1)' : '#1b2838'};
  color: ${props => props.selected ? '#66c0f4' : '#c7d5e0'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #66c0f4;
    background: rgba(102, 192, 244, 0.1);
  }
`;

const InstructionsPane = styled.div`
  background: #1b2838;
  border: 1px solid #375470;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;

  h4 {
    color: #66c0f4;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    color: #c7d5e0;
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: #66c0f4;
      position: absolute;
      left: 0;
    }
  }
`;

const AdvancedOptions = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(102, 192, 244, 0.05);
  border-radius: 8px;
`;

const BackButton = styled(Button)`
  && {
    color: #66c0f4;
    padding: 0;
    display: inline-flex;
    align-items: center;
    margin-bottom: 0;
    height: fit-content;
    min-height: 0;
    width: fit-content;
    &:hover {
      background: none;
    }
  }
`;

const ProcessingTypeIndicator = styled.div`
  background: rgba(102, 192, 244, 0.1);
  border: 1px solid #66c0f4;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: #66c0f4;
  display: inline-flex;
  align-items: center;
  margin-right: 2rem;
  font-size: 1.1rem;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${techTheme.colors.text.primary};
  svg {
    color: ${techTheme.colors.primary};
  }
`;

const BackButtonIcon = styled.button`
  background: none;
  border: none;
  color: #66c0f4;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    color: #1999ff;
  }
`;

const isFormValid = (details) => {
  const requiredStringFields = ['companyName', 'companyDescription', 'companyCategory'];
  return requiredStringFields.every(field => 
    details[field] && details[field].toString().trim()
  );
};

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const processingType = location.state?.processingType || 'simple';
  const { currentUser } = useAuth();

  // Redirect if no processing type is specified
  useCallback(() => {
    if (!location.state?.processingType) {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [adDetails, setAdDetails] = useState({
    companyName: '',
    companyDescription: '',
    companyCategory: '',
    customCompliance: false,
    batchCount: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ success: false, error: false, message: '' });

  const getBatchOptions = useCallback(() => {
    if (fileSize > 2 && fileSize <= 10) return [3, 4];
    if (fileSize > 10) return [3, 4, 5, 6];
    return [];
  }, [fileSize]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      if (processingType === 'simple' && file.size > 2 * 1024 * 1024) {
        setUploadStatus({
          success: false,
          error: true,
          message: 'File size exceeds 2MB limit for simple processing'
        });
        return;
      }
      setFile(file);
      setFileSize(file.size / (1024 * 1024));
      setUploadStatus({ 
        success: true, 
        error: false, 
        message: 'File selected successfully' 
      });
    }
  }, [processingType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  const handleInputChange = (field, value) => {
    setAdDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = async () => {
    // Check if required string fields are filled
    const requiredFields = ['companyName', 'companyDescription', 'companyCategory'];
    const isRequiredFieldsValid = requiredFields.every(field => 
      adDetails[field] && adDetails[field].toString().trim()
    );

    // Check if batch processing fields are valid when needed
    const isBatchFieldsValid = processingType === 'batch' 
      ? (adDetails.batchCount || fileSize <= 2)  // batchCount only required for files > 2MB
      : true;

    if (!file || !isRequiredFieldsValid || !isBatchFieldsValid) {
      setUploadStatus({
        success: false,
        error: true,
        message: 'Please fill in all required fields and provide a ZIP file'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('data', JSON.stringify({
        processingType,
        ...adDetails,
        userId: currentUser?.uid || null
      }));

      // Simulate initial progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 500);

      // Make API call
      const response = await uploadAd(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadStatus({
        success: true,
        error: false,
        message: 'Upload successful!'
      });

      // Navigate to report page with analysis data
      setTimeout(() => {
        navigate('/report', { 
          state: { 
            analysis: response 
          } 
        });
      }, 1000);

    } catch (error) {
      setUploadStatus({
        success: false,
        error: true,
        message: error.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <TechPageContainer>
        <TechContentWrapper>
          <TechHeader>
            <Title>
              <BackButtonIcon onClick={handleBack}>
                <FaArrowLeft size={20} />
              </BackButtonIcon>
              <FaAd /> Upload Advertisement
            </Title>
            <ProcessingTypeIndicator>
              {processingType === 'simple' ? 'Simple Processing' : 'Batch Processing'}
            </ProcessingTypeIndicator>
          </TechHeader>

          <UploadSection>
            <div>
              <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <CloudUploadIcon className="icon" />
                {file ? (
                  <>
                    <p>Selected file: {file.name}</p>
                    <p className="file-types">Click or drag to replace</p>
                  </>
                ) : (
                  <>
                    <p>Drag & drop your ZIP file here</p>
                    <p className="file-types">or click to select</p>
                    <p className="file-types">.ZIP files only</p>
                  </>
                )}
              </DropzoneArea>

              {uploadStatus.message && (
                <UploadStatus success={uploadStatus.success} error={uploadStatus.error}>
                  {uploadStatus.success ? (
                    <CheckCircleIcon className="status-icon" />
                  ) : (
                    <ErrorIcon className="status-icon" />
                  )}
                  {uploadStatus.message}
                </UploadStatus>
              )}

              {uploading && (
                <ProgressWrapper>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </ProgressWrapper>
              )}
              <InstructionsPane>
                <h4>Required Folder Structure</h4>
                <ul>
                  <li>Main Folder
                    <ul>
                      <li>text folder (containing ad text files)</li>
                      <li>image folder (containing ad images)</li>
                      <li>mapping.csv (image and text mapping paths)</li>
                      {processingType === 'batch' && (
                        <li>custom_compliance folder with complaintname.txt files (optional)</li>
                      )}
                    </ul>
                  </li>
                </ul>
              </InstructionsPane>
            </div>

            <TextInputArea>
              <h3>Company Details</h3>
              <FormGrid>
                <InputBox>
                  <label>Company Name</label>
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    value={adDetails.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </InputBox>

                <InputBox>
                  <label>Company Description</label>
                  <textarea
                    placeholder="Provide a detailed description of your company"
                    value={adDetails.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                  />
                </InputBox>

                <InputBox>
                  <label>Company Category</label>
                  <FormControl fullWidth>
                    <Select
                      value={adDetails.companyCategory}
                      onChange={(e) => handleInputChange('companyCategory', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          background: '#1b2838',
                          color: '#c7d5e0',
                          border: '1px solid #375470',
                          '&:focus': {
                            border: '1px solid #66c0f4',
                          }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '& .MuiSelect-icon': {
                          color: '#66c0f4'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#1b2838',
                            border: '1px solid #375470',
                            '& .MuiMenuItem-root': {
                              color: '#c7d5e0',
                              '&:hover': {
                                bgcolor: '#2a475e'
                              },
                              '&.Mui-selected': {
                                bgcolor: '#66c0f4',
                                color: '#1b2838',
                                '&:hover': {
                                  bgcolor: '#66c0f4'
                                }
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a category
                      </MenuItem>
                      {COMPANY_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </InputBox>
              </FormGrid>

              {processingType === 'batch' && (
                <AdvancedOptions>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={adDetails.customCompliance}
                        onChange={(e) => handleInputChange('customCompliance', e.target.checked)}
                        sx={{ color: '#66c0f4' }}
                      />
                    }
                    label="Custom Compliance Rules"
                  />

                  {fileSize > 2 && (
                    <FormControl fullWidth sx={{ marginTop: 2 }}>
                      <Select
                        value={adDetails.batchCount}
                        onChange={(e) => handleInputChange('batchCount', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select number of batches</MenuItem>
                        {getBatchOptions().map(count => (
                          <MenuItem key={count} value={count}>
                            {count} Batches
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </AdvancedOptions>
              )}

              <StyledButton
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || !file || !isFormValid(adDetails)}
              >
                {uploading ? (
                  <>
                    <CircularProgress size={20} style={{ marginRight: '0.5rem' }} />
                    Uploading...
                  </>
                ) : (
                  'Upload and Analyze'
                )}
              </StyledButton>
            </TextInputArea>
          </UploadSection>
        </TechContentWrapper>
      </TechPageContainer>
    </>
  );
};

export default Upload;
