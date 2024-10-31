import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="relative" sx={{ backgroundColor: '#4B553C' }} className="app-bar">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" className="menu-icon">
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" className="title">
          Recipe Rescue
        </Typography>
        
        <Box component="nav" className="nav-links">
          <Button component={Link} to="/" color="inherit" className="nav-button">
            Login
          </Button>
          <Button component={Link} to="/recipes" color="inherit" className="nav-button">
            All Recipes
          </Button>
          <Button component={Link} to="/signup" color="inherit" className="nav-button">
            Sign Up
          </Button>
          <Button component={Link} to="/" color="inherit" className="nav-button">
            Logout
          </Button>
          <Button component={Link} to="/filter" color="inherit" className="nav-button">
            Ingredient Filter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
