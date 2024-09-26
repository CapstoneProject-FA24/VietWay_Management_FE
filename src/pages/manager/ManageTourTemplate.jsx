import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment } from '@mui/material';
import { getFilteredTourTemplates, mockTourTemplateCategories } from '@hooks/MockTourTemplate';
import TourTemplateCard from '@components/manager/TourTemplateCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const ManageTourTemplate = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [tourTemplates, setTourTemplates] = useState([]);
    const [filteredTourTemplates, setFilteredTourTemplates] = useState([]);
    const [sortOrder, setSortOrder] = useState('name');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState([]);

    useEffect(() => {
        const fetchedTourTemplates = getFilteredTourTemplates({}, 'name');
        setTourTemplates(fetchedTourTemplates);
        setFilteredTourTemplates(fetchedTourTemplates);
    }, []);

    useEffect(() => {
        filterAndSortTourTemplates();
    }, [searchTerm, sortOrder, selectedCategories, selectedProvinces, selectedDuration, tourTemplates]);

    const filterAndSortTourTemplates = () => {
        let filtered = [...tourTemplates];

        // Filter by search term
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.TourName.toLowerCase().includes(searchTermLower) ||
                t.Description.toLowerCase().includes(searchTermLower)
            );
        }

        // Filter by categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(t => selectedCategories.some(c => c.value === t.TourTemplateCategory));
        }

        // Filter by provinces
        if (selectedProvinces.length > 0) {
            filtered = filtered.filter(t => selectedProvinces.some(p => p.value === t.TourTemplateProvince));
        }

        if (selectedDuration.length > 0) {
            filtered = filtered.filter(t => selectedDuration.some(p => p.value === t.TourTemplateDuration));
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortOrder === 'name') {
                return a.TourName.localeCompare(b.TourName);
            } else if (sortOrder === 'date') {
                return new Date(b.TourTemplateUpdatedDate) - new Date(a.TourTemplateUpdatedDate);
            }
            return 0;
        });

        setFilteredTourTemplates(filtered);
    };

    const categoryOptions = mockTourTemplateCategories.map(category => ({
        value: category.CategoryName,
        label: category.CategoryName
    }));

    const durationOptions = Array.from(new Set(tourTemplates.map(t => t.TourTemplateDuration))).map(duration => ({
        value: duration,
        label: duration
    }));

    const provinceOptions = Array.from(new Set(tourTemplates.map(t => t.TourTemplateProvince))).map(province => ({
        value: province,
        label: province
    }));

    const animatedComponents = makeAnimated();

    return (
        <Box sx={{ display: 'flex' }}>
            <Helmet>
                <title>Quản lý Tour mẫu</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: isSidebarOpen ? 5 : 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px' }}>
                <Grid container spacing={3} sx={{ mb: 3, ml: -2.7 }}>
                    <Grid item xs={8.5} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ width: '50%', mr: 0.5, mb: 1.5 }}>
                                <Typography sx={{ mt: 2 }}>
                                    Tỉnh/Thành phố
                                </Typography>
                                <ReactSelect
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={provinceOptions}
                                    onChange={setSelectedProvinces}
                                />
                            </Box>
                            <Box sx={{ width: '50%', ml: 0.5, mb: 1.5 }}>
                                <Typography sx={{ mt: 2 }}>
                                    Thời lượng
                                </Typography>
                                <ReactSelect
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={durationOptions}
                                    onChange={setSelectedDuration}
                                />
                            </Box>
                        </Box>
                        <Typography>
                            Loại Tour
                        </Typography>
                        <ReactSelect
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={categoryOptions}
                            onChange={setSelectedCategories}
                        />
                    </Grid>
                    <Grid item xs={3.5} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: '55px', borderRadius: 2 }}>
                            Thêm Tour mẫu
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm tour mẫu..."
                            size="small"
                            sx={{ width: '80%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography>
                            Sắp xếp theo
                        </Typography>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            variant="outlined"
                            sx={{ width: '200px', ml: 2, height: '40px' }}
                        >
                            <MenuItem value="name">Tên A-Z</MenuItem>
                            <MenuItem value="date">Ngày cập nhật</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {filteredTourTemplates.map(tourTemplate => (
                        <Grid item xs={isSidebarOpen ? 12 : 6} key={tourTemplate.TourTemplateId}>
                            <TourTemplateCard tour={tourTemplate} isOpen={isSidebarOpen} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ManageTourTemplate;