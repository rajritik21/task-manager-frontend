import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  Tooltip,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, userData, logout } = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const navItems = [
    { name: 'Todos', path: '/todos', icon: <FormatListBulletedIcon /> }
  ];

  // Get username from userData or use default
  const username = userData?.name || userData?.username || 'User';

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1A1F2B', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/todos"
          sx={{ 
            flexGrow: 0, 
            mr: 4, 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Todo Manager
        </Typography>

        {/* Desktop menu */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                textDecoration: 'none',
                margin: '0 10px',
                padding: '8px 15px',
                borderRadius: '4px'
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>{item.icon}</Box>
              {item.name}
            </Link>
          ))}
        </Box>

        {/* Mobile menu button */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* User name display */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          px: 2,
          py: 0.5
        }}>
          <PersonIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} />
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
            {username}
          </Typography>
        </Box>

        {/* User menu */}
        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ color: 'white' }}
            >
              <Avatar 
                src={userData?.profilePicture} 
                sx={{ width: 32, height: 32, bgcolor: '#3f51b5' }}
              >
                {username ? username.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { 
                mt: 1.5, 
                width: 200,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            mt: 1.5, 
            maxHeight: '80vh',
            width: 200,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.name}
            onClick={handleMenuClose}
            component={Link}
            to={item.path}
            sx={{ py: 1.5 }}
          >
            <Box component="span" sx={{ mr: 2, color: 'primary.main' }}>{item.icon}</Box>
            {item.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar; 