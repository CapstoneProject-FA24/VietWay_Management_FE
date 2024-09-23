import React from 'react';
import { Box } from '@mui/material';
import '@styles/ManagerHomepage.css';
import Sidebar from '@layouts/Sidebar';

const ManagerHomepage = () => {
  return (
    <Box className="managerhomepage">
      <Sidebar />
    </Box>
  );
};

export default ManagerHomepage;
