import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const uploadAd = async (formData) => {
  try {
    const response = await api.post('/analyze-ad', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to upload ad');
  }
};

export const fixAd = async (originalAnalysis, adContent) => {
  try {
    const response = await api.post('/fix-ad', {
      original_analysis: originalAnalysis,
      ad_content: adContent,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fix ad');
  }
}; 