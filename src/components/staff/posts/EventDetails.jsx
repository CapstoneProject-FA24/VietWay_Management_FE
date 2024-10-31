import React from 'react';
import { Box, Typography } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';

export default function EventDetails({ startDate, endDate }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
                Thời gian: {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
            </Typography>
        </Box>
    );
}
