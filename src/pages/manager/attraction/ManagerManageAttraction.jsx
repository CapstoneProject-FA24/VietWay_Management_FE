import React, { useState, useEffect } from 'react';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab, Pagination } from '@mui/material';
import AttractionCard from '@components/attraction/AttractionCard';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAttractions } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { fetchAttractionType } from '@services/AttractionTypeService';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { fetchPopularProvinces, fetchPopularAttractionCategories } from '@services/PopularService';

const ManagerManageAttraction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [sortOrder, setSortOrder] = useState('nameA-Z');
    const [statusTab, setStatusTab] = useState('1');
    const [provinces, setProvinces] = useState([]);
    const [attractionTypes, setAttractionTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [attrSearchTerm, setAttrSearchTerm] = useState('');
    const [attrTypes, setAttrTypes] = useState([]);
    const [attrProvinces, setAttrProvinces] = useState([]);
    const [sortedAttractions, setSortedAttractions] = useState([]);
    const [popularProvinces, setPopularProvinces] = useState([]);
    const [popularTypes, setPopularTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm, selectedTypes, selectedProvinces, statusTab]);

    useEffect(() => {
        sortAttractions();
    }, [attractions, sortOrder]);

    useEffect(() => {
        const fetchPopularData = async () => {
            try {
                const popularProvData = await fetchPopularProvinces();
                setPopularProvinces(popularProvData);

                const popularTypesData = await fetchPopularAttractionCategories();
                setPopularTypes(popularTypesData);
            } catch (error) {
                console.error('Error fetching popular data:', error);
            }
        };
        fetchPopularData();
    }, []);

    const fetchData = async () => {
        try {
            const params = {
                pageSize: pageSize,
                pageIndex: page,
                nameSearch: searchTerm,
                attractionTypeIds: selectedTypes.map(c => c.value),
                provinceIds: selectedProvinces.map(p => p.value),
                statuses: statusTab == "all" ? [1, 2, 3] : [parseInt(statusTab)]
            };
            const result = await fetchAttractions(params);
            setAttractions(result.data);
            setTotalPages(Math.ceil(result.total / pageSize));
        } catch (error) {
            console.error('Error fetching attractions:', error);
        }
    };

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
                const fetchedAttractionType = await fetchAttractionType();
                setProvinces(fetchedProvinces.items);
                setAttractionTypes(fetchedAttractionType);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchFilterData();
    }, []);

    const sortAttractions = () => {
        const sorted = [...attractions].sort((a, b) => {
            switch (sortOrder) {
                case 'nameA-Z':
                    return a.name.localeCompare(b.name);
                case 'nameZ-A':
                    return b.name.localeCompare(a.name);
                case 'createdDate':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'createdDateReverse':
                    return new Date(a.createdAt) - new Date(b.createdAt);
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

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
        })
    };

    const CustomProvinceOption = ({ children, ...props }) => {
        const isPopular = popularProvinces.includes(props.data.value);
        return (
            <div
                {...props.innerProps}
                style={{
                    padding: '8px 12px',
                    background: props.isFocused ? '#f0f0f0' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>{children}</span>
                {isPopular && (
                    <LocalFireDepartmentIcon 
                        sx={{ 
                            fontSize: '20px',
                            color: '#FF0000'
                        }} 
                    />
                )}
            </div>
        );
    };

    const CustomTypeOption = ({ children, ...props }) => {
        const isPopular = popularTypes.includes(props.data.value);
        return (
            <div
                {...props.innerProps}
                style={{
                    padding: '8px 12px',
                    background: props.isFocused ? '#f0f0f0' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>{children}</span>
                {isPopular && (
                    <LocalFireDepartmentIcon 
                        sx={{ 
                            fontSize: '20px',
                            color: '#FF0000'
                        }} 
                    />
                )}
            </div>
        );
    };

    return (
        <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
            <Helmet>
                <title>Quản lý điểm tham quan</title>
            </Helmet>
            <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Box sx={{ flexGrow: 1, p: isSidebarOpen ? 3 : 5, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
                <Grid container spacing={3} sx={{ mb: 3, ml: -5, pl: 2, pr: 2 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý điểm tham quan </Typography>
                    </Grid>
                    <Grid item xs={4.7}>
                        <Typography>
                            Tỉnh thành phố
                        </Typography>
                        <ReactSelect 
                            closeMenuOnSelect={false} 
                            components={{
                                ...animatedComponents,
                                Option: CustomProvinceOption
                            }}
                            styles={customStyles}
                            isMulti 
                            options={provinceOptions} 
                            onChange={setAttrProvinces} 
                            value={attrProvinces}
                        />
                    </Grid>
                    <Grid item xs={4.7}>
                        <Typography>
                            Loại điểm tham quan
                        </Typography>
                        <ReactSelect 
                            closeMenuOnSelect={false} 
                            components={{
                                ...animatedComponents,
                                Option: CustomTypeOption
                            }}
                            styles={customStyles}
                            isMulti 
                            options={typeOptions} 
                            onChange={setAttrTypes} 
                            value={attrTypes}
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
                            <MenuItem value="createdDate">Mới nhất</MenuItem>
                            <MenuItem value="createdDateReverse">Cũ nhất</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={statusTab} onChange={handleStatusTabChange} aria-label="attraction status tabs">
                            <Tab label="Chờ duyệt" value="1" />
                            <Tab label="Đã duyệt" value="2" />
                            <Tab label="Từ chối" value="3" />
                            <Tab label="Tất cả" value="all" />
                        </Tabs>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ minHeight: '15.2rem' }}>
                    {sortedAttractions.map(attraction => (
                        <Grid item xs={4} key={attraction.attractionId}>
                            <AttractionCard attraction={attraction} isOpen={isSidebarOpen} />
                        </Grid>
                    ))}
                    {sortedAttractions.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center" color="error">
                                Không tìm thấy điểm tham quan phù hợp.
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
            </Box>
        </Box>
    );
};

export default ManagerManageAttraction;
