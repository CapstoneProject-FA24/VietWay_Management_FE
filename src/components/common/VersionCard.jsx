import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import dayjs from 'dayjs';

const VersionCard = ({ version }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      p: 2,
      borderBottom: '1px solid #eee',
      '&:last-child': {
        borderBottom: 'none'
      }
    }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {version.changedBy}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs(version.changeDate).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>
        <Typography variant="body2" color="primary" sx={{ mb: 0.5 }}>
          {version.changeItem}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {version.note}
        </Typography>
      </Box>
    </Box>
  );
};

export default VersionCard;
