import React, { useState, useEffect } from 'react';
import SidebarStaff from '@layouts/SidebarStaff';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab, Pagination } from '@mui/material';
import AttractionCard from '@components/attraction/AttractionCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import AttractionDeletePopup from '@components/attraction/AttractionDeletePopup';
import { fetchAttractions } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import FilterListIcon from '@mui/icons-material/FilterList';

const ManageAttraction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [sortOrder, setSortOrder] = useState('createdDate');
    const [statusTab, setStatusTab] = useState('0');
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [attractionTypes, setAttractionTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [attrSearchTerm, setAttrSearchTerm] = useState('');
    const [attrTypes, setAttrTypes] = useState([]);
    const [attrProvinces, setAttrProvinces] = useState([]);
    const [sortedAttractions, setSortedAttractions] = useState([]);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm, selectedTypes, selectedProvinces, statusTab]);

    useEffect(() => {
        sortAttractions();
    }, [attractions, sortOrder]);

    const fetchData = async () => {
        try {
            const params = {
                pageSize: pageSize,
                pageIndex: page,
                nameSearch: searchTerm,
                attractionTypeIds: selectedTypes.map(c => c.value),
                provinceIds: selectedProvinces.map(p => p.value),
                statuses: statusTab == "all" ? [0, 1, 2, 3] : [parseInt(statusTab)]
            };
            const result = await fetchAttractions(params);
            setAttractions(result.data);
            setTotalPages(Math.ceil(result.total / pageSize));
        } catch (error) {
            console.error('Error fetching tour templates:', error);
        }
    };

    useEffect(() => {
        const fetchProvincesData = async () => {
            try {
                const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
                const fetchedAttractionType = await fetchAttractionType();
                setProvinces(fetchedProvinces.items);
                setAttractionTypes(fetchedAttractionType);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvincesData();
    }, []);

    const sortAttractions = () => {
        const sorted = [...attractions].sort((a, b) => {
            switch (sortOrder) {
                case 'nameA-Z':
                    return a.name.localeCompare(b.name);
                case 'nameZ-A':
                    return b.name.localeCompare(a.name);
                case 'createdDate':
                    return new Date(b.createdDate) - new Date(a.createdDate);
                case 'createdDateReverse':
                    return new Date(a.createdDate) - new Date(b.createdDate);
                default:
                    return 0;
            }
        });
        setSortedAttractions(sorted);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setPage(1);
    };

    const handleSearch = () => {
        setSearchTerm(attrSearchTerm);
        setPage(1);
    };

    const handleApplyFilter = () => {
        setSelectedTypes(attrTypes);
        setSelectedProvinces(attrProvinces);
        setPage(1);
    };

    const provinceOptions = provinces.map(province => ({
        value: province.provinceId,
        label: province.provinceName
    }));

    const typeOptions = attractionTypes.map(type => ({
        value: type.attractionTypeId,
        label: type.attractionTypeName
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
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
            <Helmet>
                <title>Quản lý điểm tham quan</title>
            </Helmet>
            <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, mt: 1.5, p: isSidebarOpen ? 3 : 5, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
                <Grid container spacing={3} sx={{ mb: 3, ml: -5, pl: 2, pr: 2 }}>
                    <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý điểm tham quan </Typography>
                    </Grid>
                    <Grid item md={4} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button component={Link} to="/nhan-vien/diem-tham-quan/them" variant="contained" color="primary"
                            startIcon={<AddIcon />} sx={{ height: '55px', borderRadius: 2 }}>
                            Thêm điểm tham quan
                        </Button>
                    </Grid>
                    <Grid item xs={4.7}>
                        <Typography sx={{ fontWeight: 600 }}>
                            Tỉnh/Thành phố
                        </Typography>
                        <ReactSelect closeMenuOnSelect={false} components={animatedComponents}
                            isMulti options={provinceOptions} onChange={setAttrProvinces} value={attrProvinces}
                        />
                    </Grid>
                    <Grid item xs={4.7}>
                        <Typography sx={{ fontWeight: 600 }}>
                            Loại điểm tham quan
                        </Typography>
                        <ReactSelect closeMenuOnSelect={false} components={animatedComponents}
                            isMulti options={typeOptions} onChange={setAttrTypes} value={attrTypes}
                        />
                    </Grid>
                    <Grid item xs={2.6} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', height: '100%' }}>
                        <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilter}
                            sx={{ mt: 1, backgroundColor: 'lightGray', color: 'black', width: '12rem' }}>
                            Áp dụng bộ lọc
                        </Button>
                    </Grid>

                    <Grid item xs={7} sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <TextField variant="outlined" placeholder="Tìm kiếm điểm tham quan..."
                            size="small" sx={{ width: '100%', mr: 1 }}
                            value={attrSearchTerm} onChange={(e) => setAttrSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: 'lightGray', color: 'black', minWidth: '7rem' }} >
                            Tìm kiếm
                        </Button>
                    </Grid>
                    <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 3 }}>
                        <Typography sx={{ fontWeight: 600 }}>
                            Sắp xếp theo
                        </Typography>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            variant="outlined"
                            sx={{ width: '200px', ml: 2, height: '40px' }}
                        >
                            <MenuItem value="createdDate">Mới nhất</MenuItem>
                            <MenuItem value="createdDateReverse">Cũ nhất</MenuItem>
                            <MenuItem value="nameA-Z">Tên A-Z</MenuItem>
                            <MenuItem value="nameZ-A">Tên Z-A</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={statusTab} onChange={handleStatusTabChange} aria-label="attraction status tabs">
                            {/* <Tab label="Tất cả" value="all" /> */}
                            <Tab label="Bản nháp" value="0" />
                            <Tab label="Chờ duyệt" value="1" />
                            <Tab label="Đã duyệt" value="2" />
                            <Tab label="Từ chối" value="3" />
                            <Tab label="Tất cả" value="all" />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ minHeight: '15.2rem' }}>
                    {sortedAttractions.map(attraction => (
                        <Grid item xs={4} key={attraction.AttractionId}>
                            <AttractionCard attraction={attraction} isOpen={isSidebarOpen} onOpenDeletePopup={handleOpenDeletePopup} />
                        </Grid>
                    ))}
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
                        <MenuItem value={6}>6 / trang</MenuItem>
                        <MenuItem value={12}>12 / trang</MenuItem>
                        <MenuItem value={24}>24 / trang</MenuItem>
                    </Select>
                </Box>
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

export default ManageAttraction;