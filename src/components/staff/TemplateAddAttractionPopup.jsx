import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, InputAdornment, Grid, Card, CardMedia } from '@mui/material';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';

const TemplateAddAttractionPopup = ({ open, onClose, onSelectAttraction, provinces, attractions, selectedAttractions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);

    useEffect(() => {
        filterAttractions();
    }, [searchTerm, selectedProvinces, attractions, selectedAttractions]);

    const filterAttractions = () => {
        let filtered = attractions.filter(attraction => 
            !selectedAttractions.some(selected => selected.attractionId === attraction.attractionId)
        );
        if (searchTerm) {
            const searchTermWithoutAccents = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            filtered = filtered.filter(a => a.name && a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents));
        }
        if (selectedProvinces.length > 0) {
            filtered = filtered.filter(a => selectedProvinces.some(p => p.value === a.province));
        }
        setFilteredAttractions(filtered);
    };

    const provinceOptions = provinces.map(province => ({
        value: province.provinceName,
        label: province.provinceName
    }));

    const handleAttractionClick = (attraction) => {
        console.log(attraction);
        onSelectAttraction(attraction);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%',
                bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: '90vh', overflowY: 'auto', height: '80vh'
            }}>
                <Typography variant="h6" component="h2">Chọn điểm tham quan</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <ReactSelect 
                        closeMenuOnSelect={false} 
                        components={makeAnimated()} 
                        isMulti 
                        options={provinceOptions}
                        onChange={setSelectedProvinces} 
                        placeholder="Chọn tỉnh thành phố..." 
                    />
                    <TextField 
                        variant="outlined" 
                        placeholder="Tìm kiếm điểm tham quan..."
                        size="small" 
                        fullWidth 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    />
                </Box>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Grid container spacing={2}>
                        {filteredAttractions.map(attraction => (
                            <Grid item xs={12} key={attraction.attractionId}>
                                <Card 
                                    sx={{ display: 'flex', height: '100px', p: '0.7rem', borderRadius: 1.5 }}
                                    onClick={() => handleAttractionClick(attraction)}
                                >
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
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
};

export default TemplateAddAttractionPopup;