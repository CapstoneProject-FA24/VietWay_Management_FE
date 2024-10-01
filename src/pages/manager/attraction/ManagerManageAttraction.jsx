import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { getFilteredAttractions, mockAttractionStatus } from '@hooks/MockAttractions';
import AttractionCard from '@components/manager/AttractionCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useLocation } from 'react-router-dom';
import AttractionDeletePopup from '@components/staff/AttractionDeletePopup';

const ManagerManageAttraction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [sortOrder, setSortOrder] = useState('name-asc');
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [statusTab, setStatusTab] = useState('all');
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedAttraction, setSelectedAttraction] = useState(null);

    useEffect(() => {
        const fetchedAttractions = getFilteredAttractions({}, 'name');
        setAttractions(fetchedAttractions);
        setFilteredAttractions(fetchedAttractions);
    }, []);

    useEffect(() => {
        filterAndSortAttractions();
    }, [searchTerm, sortOrder, selectedProvinces, selectedTypes, attractions, statusTab]);

    const filterAndSortAttractions = () => {
        let filtered = [...attractions];

        // Filter by search term
        if (searchTerm) {
            const searchTermWithoutAccents = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            filtered = filtered.filter(a =>
                a.name && a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents)
            );
        }
        if (selectedProvinces.length > 0) {
            filtered = filtered.filter(a => selectedProvinces.some(p => p.value === a.province));
        }
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(a => selectedTypes.some(t => t.value === a.attractionType));
        }
        if (statusTab !== 'all') {
            filtered = filtered.filter(a => a.statusName === statusTab);
        }
        filtered.sort((a, b) => {
            if (sortOrder === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOrder === 'name-desc') {
                return b.name.localeCompare(a.name);
            } else if (sortOrder === 'createdDate') {
                return new Date(b.createdDate) - new Date(a.createdDate);
            }else if (sortOrder === 'createdDateReverse') {
                return new Date(a.createdDate) - new Date(b.createdDate);
            }
            return 0;
        });
        setFilteredAttractions(filtered);
    };

    const provinceOptions = [...new Set(attractions.map(a => a.province))].map(province => ({
        value: province,
        label: province
    }));

    const typeOptions = [...new Set(attractions.map(a => a.attractionType))].map(type => ({
        value: type,
        label: type
    }));

    const animatedComponents = makeAnimated();

    const handleStatusTabChange = (event, newValue) => {
        setStatusTab(newValue);
    };

    const handleOpenDeletePopup = (attraction) => {
        setSelectedAttraction(attraction);
        setOpenDeletePopup(true);
    };

    const handleCloseDeletePopup = () => {
        setOpenDeletePopup(false);
        setSelectedAttraction(null);
    };

    const handleDeleteAttraction = (attractionId) => {
        /*  // Implement the delete logic here
         console.log(`Deleting template with ID: ${templateId}`);
         // After deletion, update the tourTemplates state and close the popup
         setTourTemplates(prevTemplates => prevTemplates.filter(t => t.TourTemplateId !== templateId));
         handleCloseDeletePopup(); */
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
            <Helmet>
                <title>Manage Attractions</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: isSidebarOpen ? 5 : 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
                <Grid container spacing={3} sx={{ mb: 3, ml: -5, pl: 2, pr: 2 }}>
                    <Grid item xs={7} sx={{ mb: 1 }}>
                        <Typography>
                            Tỉnh thành phố
                        </Typography>
                        <ReactSelect
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={provinceOptions}
                            onChange={setSelectedProvinces}
                        />
                        <Typography sx={{ mt: 2 }}>
                            Loại điểm tham quan
                        </Typography>
                        <ReactSelect
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={typeOptions}
                            onChange={setSelectedTypes}
                        />
                    </Grid>
                    <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            component={Link}
                            to="/nhan-vien/diem-tham-quan/them"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{ height: '55px', borderRadius: 2 }}>
                            Thêm điểm tham quan
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm điểm tham quan..."
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
                            <MenuItem value="name-asc">Tên A-Z</MenuItem>
                            <MenuItem value="name-desc">Tên Z-A</MenuItem>
                            <MenuItem value="createdDate">Mới nhất</MenuItem>
                            <MenuItem value="createdDateReverse">Cũ nhất</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={statusTab} onChange={handleStatusTabChange} aria-label="attraction status tabs">
                            <Tab label="Tất cả" value="all" />
                            {mockAttractionStatus.map((status) => (
                                <Tab key={status} label={status} value={status} />
                            ))}
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ minHeight: '15.2rem' }}>
                    {filteredAttractions.map(attraction => (
                        <Grid item xs={isSidebarOpen ? 11.5 : 6} key={attraction.AttractionId}>
                            <AttractionCard
                                attraction={attraction}
                                isOpen={isSidebarOpen} F
                                onOpenDeletePopup={handleOpenDeletePopup} />

                        </Grid>
                    ))}
                </Grid>
                <AttractionDeletePopup
                    open={openDeletePopup}
                    onClose={handleCloseDeletePopup}
                    attraction={selectedAttraction}
                    onDelete={handleDeleteAttraction}
                />
            </Box>
        </Box>
    );
};

export default ManagerManageAttraction;