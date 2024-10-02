import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { mockTourTemplateCategories } from '@hooks/MockTourTemplate';
import TourTemplateCard from '@components/manager/TourTemplateCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useLocation } from 'react-router-dom';
import TourTemplateDeletePopup from '@components/staff/TourTemplateDeletePopup';
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';

const ManagerManageTourTemplate = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [tourTemplates, setTourTemplates] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [sortOrder, setSortOrder] = useState('name');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState([]);
    const [statusTab, setStatusTab] = useState('all');
    const location = useLocation();
    const currentPage = location.pathname;
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTourTemplates = await fetchTourTemplates(100, 1);
                const fetchedProvinces = await fetchProvinces();
                setProvinces(fetchedProvinces);
                setTourTemplates(fetchedTourTemplates);
            } catch (error) {
                console.error('Error fetching tour templates:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterAndSortTourTemplates();
    }, [searchTerm, sortOrder, selectedCategories, selectedProvinces, selectedDuration, tourTemplates, statusTab]);

    const filterAndSortTourTemplates = () => {
        let filtered = [...tourTemplates];
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
            filtered = filtered.filter(t =>
                t.tourName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").includes(searchTermLower)
            );
        }
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(t => selectedCategories.some(c => c.value === t.tourCategoryName));
        }
        if (selectedProvinces.length > 0) {
            filtered = filtered.filter(t =>
                selectedProvinces.some(p =>
                    t.provinces.some(province => province === p.value)
                )
            );
        }
        if (selectedDuration.length > 0) {
            filtered = filtered.filter(t => selectedDuration.some(p => p.value === t.duration));
        }
        if (statusTab !== 'all') {
            filtered = filtered.filter(a => a.status === parseInt(statusTab));
        }
        filtered.sort((a, b) => {
            if (sortOrder === 'tourNameA-Z') {
                return a.tourName.localeCompare(b.tourName);
            } else if (sortOrder === 'tourNameZ-A') {
                return b.tourName.localeCompare(a.tourName);
            } else if (sortOrder === 'createdDate') {
                return new Date(b.createdDate) - new Date(a.createdDate);
            }else if (sortOrder === 'createdDateReverse') {
                return new Date(a.createdDate) - new Date(b.createdDate);
            }
            return 0;
        });
        return filtered;
    };

    const filteredTourTemplates = filterAndSortTourTemplates();

    const categoryOptions = mockTourTemplateCategories.map(category => ({
        value: category.categoryName,
        label: category.categoryName
    }));

    const durationOptions = Array.from(new Set(tourTemplates.map(t => t.duration))).map(duration => ({
        value: duration,
        label: duration + ' ngày'
    }));

    const provinceOptions = provinces.map(province => ({
        value: province.provinceName,
        label: province.provinceName
    }));

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const animatedComponents = makeAnimated();

    const handleOpenDeletePopup = (template) => {
        setSelectedTemplate(template);
        setOpenDeletePopup(true);
    };

    const handleCloseDeletePopup = () => {
        setOpenDeletePopup(false);
        setSelectedTemplate(null);
    };

    const handleDeleteTemplate = (templateId) => {
       /*  // Implement the delete logic here
        console.log(`Deleting template with ID: ${templateId}`);
        // After deletion, update the tourTemplates state and close the popup
        setTourTemplates(prevTemplates => prevTemplates.filter(t => t.TourTemplateId !== templateId));
        handleCloseDeletePopup(); */
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw' }}>
            <Helmet>
                <title>Quản lý Tour mẫu</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', width: isSidebarOpen ? 'calc(100vw - 260px)' : 'calc(100vw - 20px)', overflowX: 'hidden' }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8.5} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, mr: { md: 0.5 }, mb: 1.5 }}>
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
                            <Box sx={{ width: { xs: '100%', md: '50%' }, ml: { md: 0.5 }, mb: 1.5 }}>
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
                    <Grid item xs={12} md={3.5} sx={{ display: 'flex', justifyContent: 'flex-end', mt: { xs: 2, md: 3 } }}>
                        <Button component={Link} to={currentPage + "/them"} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: '55px', borderRadius: 2 }}>
                            Thêm Tour mẫu
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm tour mẫu..."
                            size="small"
                            sx={{ width: '100%', maxWidth: '400px' }}
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
                    <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Typography>
                            Sắp xếp theo
                        </Typography>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            variant="outlined"
                            sx={{ width: '200px', ml: 2, height: '40px' }}
                        >
                            <MenuItem value="tourNameA-Z">Tên A-Z</MenuItem>
                            <MenuItem value="tourNameZ-A">Tên Z-A</MenuItem>
                            <MenuItem value="createdDate">Mới nhất</MenuItem>
                            <MenuItem value="createdDateReverse">Cũ nhất</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={statusTab} onChange={handleStatusTabChange} aria-label="tour template status tabs" variant="scrollable" scrollButtons="auto">
                            <Tab label="Tất cả" value="all" />
                            <Tab label="Bản nháp" value="0" />
                            <Tab label="Chờ duyệt" value="1" />
                            <Tab label="Đã duyệt" value="2" />
                            <Tab label="Từ chối" value="3" />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ minHeight: '15.2rem' }}>
                    {filteredTourTemplates.map(tourTemplate => (
                        <Grid item xs={12} sm={6} md={isSidebarOpen ? 12 : 6} key={tourTemplate.tourTemplateId}>
                            <TourTemplateCard 
                                tour={tourTemplate} 
                                isOpen={isSidebarOpen} 
                                onOpenDeletePopup={handleOpenDeletePopup}
                            />
                        </Grid>
                    ))}
                </Grid>
                <TourTemplateDeletePopup
                    open={openDeletePopup}
                    onClose={handleCloseDeletePopup}
                    template={selectedTemplate}
                    onDelete={handleDeleteTemplate}
                />
            </Box>
        </Box>
    );
};

export default ManagerManageTourTemplate;