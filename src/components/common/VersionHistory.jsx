import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import VersionCard from '@components/common/VersionCard';
import { mockVersionHistory } from '@hooks/MockVersionHistory';

const VersionHistory = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid #eee',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '20px' }}>
          Lịch sử thay đổi
        </Typography>
        <Badge sx={{ position: 'relative', right: '12px' }}
          badgeContent={mockVersionHistory.length} 
          color="primary" 
        />
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {mockVersionHistory.map((version) => (
          <VersionCard key={version.id} version={version} />
        ))}
      </Box>
    </Box>
  );
};

export default VersionHistory;
