import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, InputAdornment, Grid, Card, CardMedia, Pagination, Button } from '@mui/material';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAttractions } from '@services/AttractionService';

const attractionTypes = [
    { AttractionTypeId: 1, Name: 'Công viên giải trí' }, { AttractionTypeId: 10, Name: 'Khu du lịch văn hóa' },
];

const TemplateAddAttractionPopup = ({ open, onClose, onSelectAttraction, provinces, selectedAttractions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const params = {
                pageSize: 3, pageIndex: page, nameSearch: searchTerm,
                attractionTypeIds: selectedTypes.map(c => c.value),
                provinceIds: selectedProvinces.map(p => p.value),
                status: 2
            };
            const result = await fetchAttractions(params);
            setAttractions(result.data.sort((a, b) => a.name.localeCompare(b.name)));
            setTotalPages(Math.ceil(result.total / 3));
        } catch (error) {
            console.error('Error fetching attractions:', error);
        }
    };

    const provinceOptions = provinces.map(province => ({
        value: province.provinceId,
        label: province.provinceName
    }));

    const typeOptions = attractionTypes.map(type => ({
        value: type.AttractionTypeId,
        label: type.Name
    }));

    const handleAttractionClick = (attraction) => {
        if (selectedAttractions.some(selectedAttraction => selectedAttraction.attractionId === attraction.attractionId)) {
            alert(attraction.name + " đã được thêm vào danh sách.");
            return;
        }else{
            onSelectAttraction(attraction);
            onClose();
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    const handleApplyFilter = () => {
        setPage(1);
        fetchData();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '65%',
                bgcolor: 'background.paper', boxShadow: 24, p: 3, maxHeight: '90vh', overflowY: 'auto', height: '90vh'
            }}>
                <Typography variant="h6" component="h2">Chọn điểm tham quan</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <ReactSelect closeMenuOnSelect={false} components={makeAnimated()}
                            isMulti options={provinceOptions} onChange={setSelectedProvinces}
                            placeholder="Lọc theo tỉnh thành phố..."
                            styles={{ container: (provided) => ({ ...provided, width: '45%', marginRight: '10px' }) }}/>
                        <ReactSelect closeMenuOnSelect={false} components={makeAnimated()}
                            isMulti options={typeOptions} onChange={setSelectedTypes}
                            placeholder="Lọc theo loại điểm tham quan..."
                            styles={{ container: (provided) => ({ ...provided, width: '45%' }) }}/>
                        <Button variant="contained" onClick={handleApplyFilter} sx={{ ml: 1, width: '15%' }}>Áp dụng</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField variant="outlined" placeholder="Tìm kiếm điểm tham quan..."
                            size='small' sx={{ width: '85.5%' }} fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}/>
                        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1, minWidth: '14.5%' }}>Tìm kiếm</Button>
                    </Box>
                </Box>
                <Box sx={{ maxHeight: '55vh', overflowY: 'auto', height: '55vh' }}>
                    <Grid container spacing={0.5}>
                        {attractions.length > 0 ? (
                            attractions.map(attraction => (
                                <Grid item xs={12} key={attraction.attractionId}>
                                    <Card sx={{ display: 'flex', height: '6.5rem', p: '0.5rem', borderRadius: 1 }}
                                        onClick={() => handleAttractionClick(attraction)}>
                                        <CardMedia component="img" sx={{ width: '8rem', height: 'auto', borderRadius: 1 }}
                                            image={attraction.imageUrl} alt={attraction.name} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
                                            <Typography variant="h6" component="div"> {attraction.name} </Typography>
                                            <Typography variant="body2" color="text.secondary"> {attraction.province}</Typography>
                                            <Typography variant="body2" color="text.secondary"> Địa chỉ: {attraction.address}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ 
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                height: '55vh',
                                color: 'text.secondary'
                            }}>
                                <Typography variant="h6">
                                    Không tìm thấy điểm tham quan phù hợp
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, ml: 8 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" sx={{ m: '0 auto' }} />
                </Box>
            </Box>
        </Modal>
    );
};

export default TemplateAddAttractionPopup;