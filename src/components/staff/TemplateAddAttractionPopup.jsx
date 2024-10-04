import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { getFilteredAttractions } from '@hooks/MockAttractions';
import TemplateAddAttractionCard from '@components/staff/TemplateAddAttractionCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';

const TemplateAddAttractionPopup = ({ open, onClose, onSelectAttraction, provinceList }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProvinces(provinceList);
                const fetchedAttractions = getFilteredAttractions({ status: 2 }, 'name');
                setAttractions(fetchedAttractions);
                setFilteredAttractions(fetchedAttractions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterAttractions();
    }, [searchTerm, selectedProvinces, attractions]);

    const filterAttractions = () => {
        let filtered = [...attractions];
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

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', 
                bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: '90vh', overflowY: 'auto', height: '80vh' }}>
                <Typography variant="h6" component="h2">Chọn điểm tham quan</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <ReactSelect closeMenuOnSelect={false} components={makeAnimated()} isMulti options={provinceOptions}
                        onChange={setSelectedProvinces} placeholder="Chọn tỉnh thành phố..." />
                    <TextField variant="outlined" placeholder="Tìm kiếm điểm tham quan..."
                        size="small" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    />
                </Box>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Grid container spacing={2}>
                        {filteredAttractions.map(attraction => (
                            <Grid item xs={12} key={attraction.AttractionId}>
                                <TemplateAddAttractionCard attraction={attraction} onClick={() => onSelectAttraction(attraction)} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
};

export default TemplateAddAttractionPopup;