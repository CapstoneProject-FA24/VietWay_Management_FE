import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab, Pagination } from '@mui/material';
import TourTemplateCard from '@components/tourTemplate/TourTemplateCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';
import FilterListIcon from '@mui/icons-material/FilterList';

const ManagerManageTourTemplate = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [tourTemplates, setTourTemplates] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [durations, setDurations] = useState([]);
    const [sortOrder, setSortOrder] = useState('name');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState([]);
    const [statusTab, setStatusTab] = useState('all');
    const location = useLocation();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [tempCategories, setTempCategories] = useState([]);
    const [tempProvinces, setTempProvinces] = useState([]);
    const [tempDuration, setTempDuration] = useState([]);
    const [sortedTourTemplates, setSortedTourTemplates] = useState([]);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm, selectedCategories, selectedProvinces, selectedDuration, statusTab]);

    useEffect(() => {
        sortTourTemplates();
    }, [tourTemplates, sortOrder]);

    const fetchData = async () => {
        try {
            const params = {
                pageSize: pageSize,
                pageIndex: page,
                searchTerm: searchTerm,
                templateCategoryIds: selectedCategories.map(c => c.value),
                durationIds: selectedDuration.map(d => d.value),
                provinceIds: selectedProvinces.map(p => p.value),
                status: statusTab === 'all' ? null : parseInt(statusTab)
            };
            const result = await fetchTourTemplates(params);
            setTourTemplates(result.data);
            setTotalPages(Math.ceil(result.total / pageSize));
        } catch (error) {
            console.error('Error fetching tour templates:', error);
        }
    };

    useEffect(() => {
        const fetchProvincesData = async () => {
            try {
                const fetchedProvinces = await fetchProvinces();
                const fetchedCategories = await fetchTourCategory();
                const fetchedDurations = await fetchTourDuration();
                setProvinces(fetchedProvinces);
                setCategories(fetchedCategories);
                setDurations(fetchedDurations);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvincesData();
    }, []);

    const categoryOptions = categories.map(category => ({
        value: category.tourCategoryId,
        label: category.tourCategoryName
    }));

    const durationOptions = durations.map(duration => ({
        value: duration.durationId,
        label: duration.durationName
    }));

    const provinceOptions = provinces.map(province => ({
        value: province.provinceId,
        label: province.provinceName
    }));

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const animatedComponents = makeAnimated();

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setPage(1);
    };

    const handleSearch = () => {
        setSearchTerm(tempSearchTerm);
        setPage(1);
    };

    const handleApplyFilter = () => {
        setSelectedCategories(tempCategories);
        setSelectedProvinces(tempProvinces);
        setSelectedDuration(tempDuration);
        setPage(1);
    };

    const sortTourTemplates = () => {
        const sorted = [...tourTemplates].sort((a, b) => {
            switch (sortOrder) {
                case 'tourNameA-Z':
                    return a.tourName.localeCompare(b.tourName);
                case 'tourNameZ-A':
                    return b.tourName.localeCompare(a.tourName);
                case 'createdDate':
                    return new Date(b.createdDate) - new Date(a.createdDate);
                case 'createdDateReverse':
                    return new Date(a.createdDate) - new Date(b.createdDate);
                default:
                    return 0;
            }
        });
        setSortedTourTemplates(sorted);
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
            <Helmet>
                <title>Quản lý tour mẫu</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', width: isSidebarOpen ? 'calc(100vw - 260px)' : 'calc(100vw - 20px)', overflowX: 'hidden' }}>
                <Grid container spacing={3} sx={{ mb: 3}}>
                    <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý tour mẫu </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, mr: 1.5 }}>
                                <Typography>
                                    Tỉnh/Thành phố
                                </Typography>
                                <ReactSelect
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={provinceOptions}
                                    onChange={setTempProvinces}
                                    value={tempProvinces}
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, ml: 1.5 }}>
                                <Typography>
                                    Thời lượng
                                </Typography>
                                <ReactSelect
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={durationOptions}
                                    onChange={setTempDuration}
                                    value={tempDuration}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9.3} sx={{ mb: 1, mt: -2 }}>
                        <Typography>
                            Loại Tour
                        </Typography>
                        <ReactSelect
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={categoryOptions}
                            onChange={setTempCategories}
                            value={tempCategories}
                        />
                    </Grid>
                    <Grid item xs={12} md={2.7} sx={{ mb: 5 }}>
                        <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilter} sx={{ mt: 1, backgroundColor: 'lightGray', color: 'black', width: '100%' }}>
                            Áp dụng bộ lọc
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                variant="outlined"
                                placeholder="Tìm kiếm tour mẫu..."
                                size="small"
                                sx={{ width: '100%', maxWidth: '400px', mr: 1 }}
                                value={tempSearchTerm}
                                onChange={(e) => setTempSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: 'lightGray', color: 'black' }} >
                                Tìm kiếm
                            </Button>
                        </Box>
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
                <Grid container spacing={2}>
                    {sortedTourTemplates.map(tourTemplate => (
                        <Grid item xs={12} sm={6} md={4} key={tourTemplate.tourTemplateId}>
                            <TourTemplateCard
                                tour={tourTemplate}
                                isOpen={isSidebarOpen}
                            />
                        </Grid>
                    ))}
                    {sortedTourTemplates.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center" color="error">
                                Không tìm thấy tour phù hợp.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ m: '0 auto' }}
                    />
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        variant="outlined"
                        sx={{ height: '40px' }}
                    >
                        <MenuItem value={5}>5 / trang</MenuItem>
                        <MenuItem value={10}>10 / trang</MenuItem>
                        <MenuItem value={20}>20 / trang</MenuItem>
                    </Select>
                </Box>
            </Box>
        </Box>
    );
};

export default ManagerManageTourTemplate;