import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Box } from '@mui/material';

import { TodoProvider } from './context/TodoContext';
import Todos from './components/Todos';

function App() {
  // Clean up localStorage on app initialization
  useEffect(() => {
    const allowedKeys = ['token', 'userData'];
    
    // Remove any unnecessary items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return (
    <AuthProvider>
      <TodoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <Box sx={{ mt: '64px' }}> {/* To offset the fixed Navbar */}
                      <Todos />
                    </Box>
                  </Box>
                </PrivateRoute>
              }
            />
            {/* Redirect dashboard to todos */}
            <Route path="/dashboard" element={<Navigate to="/todos" />} />
            <Route path="*" element={<Navigate to="/todos" />} />
          </Routes>
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
}

export default App;
