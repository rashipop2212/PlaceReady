import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/resume';

function authHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getResumeStatus = () =>
  axios.get(`${API_BASE}/status`, { headers: authHeader() });

export const getMatch = (companyId) =>
  axios.get(`${API_BASE}/match/${companyId}`, { headers: authHeader() });

export const getAllMatches = () =>
  axios.get(`${API_BASE}/match-all`, { headers: authHeader() });