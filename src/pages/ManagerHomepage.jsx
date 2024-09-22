import React from 'react';
import { Box } from '@mui/material';
import '@styles/ManagerHomepage.css';
import Header from '@layouts/Header';
import Sidebar from '@layouts/Sidebar';

const ManagerHomepage = () => {
  return (
    <Box className="managerhomepage">
      <Sidebar />
      <Box component="header" className="hero" sx={{ ml: "-60px", mr: "-60px" }}>
      </Box>
    </Box>
  );
};

export default ManagerHomepage;
