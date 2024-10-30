import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab, Pagination } from '@mui/material';
import ProvinceCard from '@components/manager/province/ProvinceCard';
import SearchIcon from '@mui/icons-material/Search';
import { fetchProvinces } from '@services/ProvinceService';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CreateProvince from '@components/manager/province/CreateProvince';

const ManagerManageProvince = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('nameA-Z');
    const [sortedProvinces, setSortedProvinces] = useState([]);
    const navigate = useNavigate();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        if (!role || !token || role !== 'quan-ly') { navigate(`/dang-nhap`); }
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm]);

    useEffect(() => {
        sortProvinces();
    }, [provinces, sortOrder]);

    const fetchData = async () => {
        try {
            /* const params = {
                pageSize: pageSize,
                pageIndex: page,
                nameSearch: searchTerm,
            }; */
            const result = await fetchProvinces();
            setProvinces(result);
            setTotalPages(Math.ceil(result.total / pageSize));
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const sortProvinces = () => {
        const sorted = [...provinces].sort((a, b) => {
            switch (sortOrder) {
                case 'nameA-Z':
                    return a.provinceName.localeCompare(b.provinceName);
                case 'nameZ-A':
                    return b.provinceName.localeCompare(a.provinceName);
                default:
                    return 0;
            }
        });
        setSortedProvinces(sorted);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setPage(1);
    };

    const handleSearch = () => {
        setSearchTerm(searchTerm);
        setPage(1);
    };

    const handleCreateSuccess = () => {
        fetchData();
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
            <Helmet>
                <title>Quản lý tỉnh thành</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: isSidebarOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
                <Grid container spacing={3} sx={{ mb: 3, ml: -5, pl: 2, pr: 2 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}>
                            Quản lý tỉnh thành
                        </Typography>
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{
                                height: '45px',
                                borderRadius: 2,
                                fontSize: '1rem',
                                textTransform: 'none'
                            }}
                        >
                            Thêm tỉnh thành
                        </Button>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField variant="outlined" placeholder="Tìm kiếm tỉnh thành..."
                            size="small" sx={{ width: '100%' }}
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                            <MenuItem value="nameA-Z">Tên A-Z</MenuItem>
                            <MenuItem value="nameZ-A">Tên Z-A</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ minHeight: '15.2rem' }}>
                    {sortedProvinces.map(province => (
                        <Grid item xs={isSidebarOpen ? 6 : 4} key={province.provinceId}>
                            <ProvinceCard province={province} />
                        </Grid>
                    ))}
                    {sortedProvinces.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center" color="error">
                                Không tìm thấy tỉnh thành phù hợp.
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
                        <MenuItem value={6}>6 / trang</MenuItem>
                        <MenuItem value={12}>12 / trang</MenuItem>
                        <MenuItem value={24}>24 / trang</MenuItem>
                    </Select>
                </Box>

                <CreateProvince
                    open={createDialogOpen}
                    handleClose={() => setCreateDialogOpen(false)}
                    onCreateSuccess={handleCreateSuccess}
                />
            </Box>
        </Box>
    );
};

export default ManagerManageProvince;
