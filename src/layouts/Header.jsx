import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1, width: '100%' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/trang-chu" sx={{ color: 'text.primary' }}>
          <img src="logo2_color.png" alt="Logo" style={{ height: '55px', marginTop: '15px' }} />
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;