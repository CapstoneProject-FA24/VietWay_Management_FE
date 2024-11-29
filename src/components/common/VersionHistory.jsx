import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Badge } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import VersionCard from '@components/common/VersionCard';
import { mockVersionHistory } from '@hooks/MockVersionHistory';

const VersionHistory = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange}
      sx={{ 
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderBottom: '1px solid #eee',
          '&.Mui-expanded': {
            minHeight: 48,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Lịch sử thay đổi
          </Typography>
          <Badge 
            badgeContent={mockVersionHistory.length} 
            color="primary" 
            sx={{ ml: 2 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {mockVersionHistory.map((version) => (
            <VersionCard key={version.id} version={version} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default VersionHistory;
