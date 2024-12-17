import React, { useState, useEffect } from "react";
import { 
    Box, Typography, TextField, Button, 
    InputAdornment, Grid, Dialog, Select, 
    MenuItem, IconButton
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourTemplatesWithTourInfo } from '@services/TourTemplateService';
import CBTemplateCard from './CB-TemplateCard';
import Pagination from '@mui/material/Pagination';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterListIcon from '@mui/icons-material/FilterList';

const ChangeBooking = ({ open, onClose, onTourSelect, booking, onRefresh }) => {
    const [tours, setTours] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: "",
        provinceIds: [],
        templateCategoryIds: [],
        numberOfDay: [],
        startDateFrom: null,
        startDateTo: null
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [tempSearchCode, setTempSearchCode] = useState("");
    
    const [provinces, setProvinces] = useState([]);
    const [tourCategories, setTourCategories] = useState([]);
    const [tourDurations, setTourDurations] = useState([]);
    
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 9,
        total: 0
    });

    const [tempFilters, setTempFilters] = useState({
        tourType: [],
        duration: [],
        location: [],
    });
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [tempDateRange, setTempDateRange] = useState({ from: null, to: null });

    const customSelectStyles = {
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            zIndex: 9999
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white'
        }),
    };

    const fetchTours = async () => {
        try {
            const params = {
                pageSize: pagination.pageSize,
                pageIndex: pagination.pageIndex,
                tourId: booking?.tourId,
                searchTerm: filters.searchTerm,
            };

            if (filters.provinceIds && filters.provinceIds.length > 0) {
                params.provinceIds = filters.provinceIds;
            }

            if (filters.templateCategoryIds && filters.templateCategoryIds.length > 0) {
                params.templateCategoryIds = filters.templateCategoryIds;
            }

            if (filters.numberOfDay && filters.numberOfDay.length > 0) {
                params.numberOfDay = filters.numberOfDay;
            }

            if (filters.startDateFrom) {
                params.startDateFrom = filters.startDateFrom;
            }

            if (filters.startDateTo) {
                params.startDateTo = filters.startDateTo;
            }

            const response = await fetchTourTemplatesWithTourInfo(params);
            setTours(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });      
                const fetchedCategories = await fetchTourCategory();
                const fetchedDuration = await fetchTourDuration();
                setProvinces(fetchedProvinces.items);
                setTourCategories(fetchedCategories);
                setTourDurations(fetchedDuration);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        if (open) {
            fetchInitialData();
            fetchTours();
        }
    }, [open, pagination.pageIndex, pagination.pageSize, filters]);

    const handleSearchByName = () => {
        setFilters(prev => ({
            ...prev,
            searchTerm: tempSearchTerm
        }));
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
    };

    const handleSearchByCode = () => {
        setSearchCode(tempSearchCode);
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
        fetchTours();
    };

    const handleKeyPress = (event, searchType) => {
        if (event.key === 'Enter') {
            if (searchType === 'name') {
                handleSearchByName();
            } else if (searchType === 'code') {
                handleSearchByCode();
            }
        }
    };

    const handleTempFilterChange = (selectedOptions, filterType) => {
        if (filterType === 'duration') {
            setTempFilters(prev => ({
                ...prev,
                [filterType]: selectedOptions ? selectedOptions.map(option => Number(option.value)) : []
            }));
        } else {
            setTempFilters(prev => ({
                ...prev,
                [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
            }));
        }
    };

    const handleApplyFilters = () => {
        const newFilters = {
            searchTerm: tempSearchTerm,
            provinceIds: tempFilters.location.length > 0 ? tempFilters.location : [],
            templateCategoryIds: tempFilters.tourType.length > 0 ? tempFilters.tourType : [],
            numberOfDay: tempFilters.duration.length > 0 ? tempFilters.duration : [],
            startDateFrom: tempDateRange.from ? tempDateRange.from.format('YYYY-MM-DD') : null,
            startDateTo: tempDateRange.to ? tempDateRange.to.format('YYYY-MM-DD') : null
        };

        setFilters(newFilters);
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
    };

    const handleClearFilters = () => {
        setTempSearchTerm("");
        setTempSearchCode("");
        setTempFilters({
            tourType: [],
            duration: [],
            location: [],
        });
        setTempDateRange({ from: null, to: null });
        setFilters({
            searchTerm: "",
            provinceIds: [],
            templateCategoryIds: [],
            numberOfDay: [],
            startDateFrom: null,
            startDateTo: null
        });
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>Chọn tour thay đổi</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', width: '100%' }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Tìm kiếm tour theo tên..."
                                    size="small"
                                    sx={{ mr: 1, width: '70%' }}
                                    value={tempSearchTerm}
                                    onChange={(e) => setTempSearchTerm(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, 'name')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    onClick={handleSearchByName}
                                    sx={{ backgroundColor: 'lightGray', color: 'black' }}
                                >
                                    Tìm kiếm
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ borderRadius: 1, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Loại tour</Typography>
                                    <ReactSelect
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        isMulti
                                        options={tourCategories.map(cat => ({
                                            value: cat.tourCategoryId,
                                            label: cat.tourCategoryName
                                        }))}
                                        value={tourCategories
                                            .filter(cat => tempFilters.tourType.includes(cat.tourCategoryId))
                                            .map(cat => ({
                                                value: cat.tourCategoryId,
                                                label: cat.tourCategoryName
                                            }))}
                                        onChange={(selected) => handleTempFilterChange(selected, 'tourType')}
                                        styles={customSelectStyles}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Địa điểm</Typography>
                                    <ReactSelect
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        isMulti
                                        options={provinces.map(prov => ({
                                            value: prov.provinceId,
                                            label: prov.provinceName
                                        }))}
                                        value={provinces
                                            .filter(prov => tempFilters.location.includes(prov.provinceId))
                                            .map(prov => ({
                                                value: prov.provinceId,
                                                label: prov.provinceName
                                            }))}
                                        onChange={(selected) => handleTempFilterChange(selected, 'location')}
                                        styles={customSelectStyles}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Ngày khởi hành</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <DatePicker
                                                value={tempDateRange.from}
                                                onChange={(newValue) => setTempDateRange(prev => ({ ...prev, from: newValue }))}
                                                slotProps={{ textField: { size: 'small' } }}
                                                format="DD/MM/YYYY"
                                            />
                                            <DatePicker
                                                value={tempDateRange.to}
                                                onChange={(newValue) => setTempDateRange(prev => ({ ...prev, to: newValue }))}
                                                slotProps={{ textField: { size: 'small' } }}
                                                format="DD/MM/YYYY"
                                            />
                                        </Box>
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleClearFilters}
                                            startIcon={<FilterListIcon />}
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleApplyFilters}
                                            startIcon={<FilterListIcon />}
                                        >
                                            Áp dụng bộ lọc
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        {tours.length > 0 ? (
                            <>
                                <Grid container spacing={2}>
                                    {tours.map((tour) => (
                                        <Grid item xs={12} key={tour.tourTemplateId}>
                                            <CBTemplateCard 
                                                tour={tour}
                                                onSelect={onTourSelect}
                                                booking={booking}
                                                onRefresh={onRefresh}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ width: '10%' }}/>
                                    <Pagination
                                        count={Math.ceil(pagination.total / pagination.pageSize)}
                                        page={pagination.pageIndex}
                                        onChange={(e, newPage) => setPagination(prev => ({ ...prev, pageIndex: newPage }))}
                                        color="primary"
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Select
                                            value={pagination.pageSize}
                                            size="small"
                                            sx={{ minWidth: 80 }}
                                            onChange={(e) => {
                                                setPagination(prev => ({
                                                    ...prev,
                                                    pageSize: parseInt(e.target.value, 10),
                                                    pageIndex: 1
                                                }));
                                            }}
                                        >
                                            <MenuItem value={9}>9</MenuItem>
                                            <MenuItem value={18}>18</MenuItem>
                                            <MenuItem value={27}>27</MenuItem>
                                        </Select>
                                        <Typography>/trang</Typography>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                                Không có kết quả nào
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    );
};

export default ChangeBooking;
