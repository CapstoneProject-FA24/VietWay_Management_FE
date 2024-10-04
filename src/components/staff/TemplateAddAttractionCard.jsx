import React from 'react';
import { Card, CardMedia, Typography, Box } from '@mui/material';

const TemplateAddAttractionCard = ({ attraction }) => {
    return (
        <Card sx={{ display: 'flex', height: '100px', p: '0.7rem', borderRadius: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ width: '100px', height: '100px', borderRadius: 1.5 }}
                image={attraction.attractionImages[0].url}
                alt={attraction.attractionImages[0].alt}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
                <Typography variant="h6" component="div">
                    {attraction.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {attraction.province}
                </Typography>
            </Box>
        </Card>
    );
};

export default TemplateAddAttractionCard;
