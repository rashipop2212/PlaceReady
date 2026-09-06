import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/roadmap';

function authHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export const getProgress = () =>
  axios.get(`${API_BASE}/progress`, { headers: authHeader() });

export const toggleTask = (taskId) =>
  axios.post(`${API_BASE}/toggle`, { taskId }, { headers: authHeader() });