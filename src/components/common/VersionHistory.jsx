import React, { useState, useEffect } from 'react';
import { Box, Typography, Badge } from '@mui/material';
import VersionCard from '@components/common/VersionCard';
import { fetchEntityHistory } from '@services/EntityHistory';

const VersionHistory = ({ entityId, entityType }) => {
  console.log(entityId);
  console.log(entityType);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await fetchEntityHistory(entityId, entityType);
        setVersions(historyData);
        console.log(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (entityId && entityType !== undefined) {
      fetchHistory();
    }
  }, [entityId, entityType]);

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
          badgeContent={versions.length} 
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
        {versions && versions.length > 0 ? (
          versions.map((version, index) => (
            <VersionCard 
              key={index} 
              version={version} 
              entityType={entityType}
            />
          ))
        ) : (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            Không có lịch sử thay đổi
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VersionHistory;
