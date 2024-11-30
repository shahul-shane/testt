import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, CircularProgress, LinearProgress, Select, MenuItem, FormControl } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { 
  TechPageContainer, 
  TechContentWrapper, 
  TechHeader, 
  TechForm,
  typography 
} from '../components/TechStyles';

const UploadSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
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
  background: #2a475e;
  border: 1px solid #375470;
  border-radius: 3px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #66c0f4;
    box-shadow: 0 0 0 1px #66c0f4;
  }

  label {
    display: block;
    color: #66c0f4;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  input, textarea {
    width: 100%;
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

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [adDetails, setAdDetails] = useState({
    companyName: '',
    companyDescription: '',
    companyCategory: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ success: false, error: false, message: '' });

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length) {
      setFile(acceptedFiles[0]);
      setUploadStatus({ success: true, error: false, message: 'File selected successfully' });
    }
  }, []);

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
    const isFormValid = Object.values(adDetails).every(value => value.trim());
    
    if (!file || !isFormValid) {
      setUploadStatus({
        success: false,
        error: true,
        message: 'Please fill in all fields and provide a ZIP file'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploadStatus({
        success: true,
        error: false,
        message: 'Upload successful!'
      });

      // Navigate to report page
      setTimeout(() => {
        navigate('/report');
      }, 1000);
    } catch (error) {
      setUploadStatus({
        success: false,
        error: true,
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <TechPageContainer>
      <TechContentWrapper>
        <TechHeader>
          <div>
            <h1>Upload Advertisement</h1>
            <p>Upload your ad assets and provide company details for analysis</p>
          </div>
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

            <StyledButton
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || !file || !Object.values(adDetails).every(value => value.trim())}
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
  );
};

export default Upload;
