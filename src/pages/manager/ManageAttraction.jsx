import React, { useState } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid } from '@mui/material';
import { getFilteredAttractions } from '@hooks/MockAttractions';
import AttractionCard from '@components/manager/AttractionCard';

const ManageAttraction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch attractions (you can add filters and sorting as needed)
    const attractions = getFilteredAttractions({}, 'name');

    return (
        <Box sx={{ display: 'flex' }}>
            <Helmet>
                <title>Manage Attractions</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: isSidebarOpen ? 5 : 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
                <Grid container spacing={2}>
                    {attractions.map(attraction => (
                        <Grid item xs={ isSidebarOpen ? 11.5 : 6}>
                            <AttractionCard key={attraction.id} attraction={attraction} isOpen={isSidebarOpen} />
                        </Grid>
                    ))}
                </Grid>

            </Box>
        </Box>
    );
};

export default ManageAttraction;