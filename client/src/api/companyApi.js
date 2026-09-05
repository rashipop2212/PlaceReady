import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/companies';

export const getCompanies = () => axios.get(API_BASE);
export const getCompany = (id) => axios.get(`${API_BASE}/${id}`);
export const createCompany = (data) => axios.post(API_BASE, data);
export const updateCompany = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteCompany = (id) => axios.delete(`${API_BASE}/${id}`);