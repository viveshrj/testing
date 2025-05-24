import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5173/api/v1',  // Make sure this matches your backend URL
  withCredentials: true,  // Important for sending cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;