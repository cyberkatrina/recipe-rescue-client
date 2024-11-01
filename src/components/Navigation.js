import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import * as cookie from "cookie";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cookies = cookie.parse(document.cookie);
    return cookies.name;
  });

  const location = useLocation(); // to trigger effect on route change

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setIsLoggedIn(cookies.name || null);
  }, [location]); // re-run effect when route changes

  const handleLogout = () => {
    document.cookie = cookie.serialize("name", "", { maxAge: 0, path: "/" });
    setIsLoggedIn(null); // Update the state immediately
  };

  return (
    <AppBar
      position="relative"
      sx={{ backgroundColor: "#4B553C" }}
      className="app-bar"
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className="menu-icon"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className="title">
          Recipe Rescue
        </Typography>

        {isLoggedIn ? <span>Welcome, {isLoggedIn}</span> : <span></span>}

        <Box component="nav" className="nav-links">
          {!isLoggedIn ? (
            <>
              <Button
                component={Link}
                to="/"
                color="inherit"
                className="nav-button"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
                className="nav-button"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/"
              color="inherit"
              onClick={handleLogout}
              className="nav-button"
            >
              Logout
            </Button>
          )}
          {isLoggedIn ? (
            <Button
              component={Link}
              to="/recipes"
              color="inherit"
              className="nav-button"
            >
              Recipes
            </Button>
          ) : (
            <span></span>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
