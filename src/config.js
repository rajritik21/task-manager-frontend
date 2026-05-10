const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://task-manager-api-otuo.onrender.com/api'
    : 'http://localhost:5001/api';

export default API_BASE_URL;