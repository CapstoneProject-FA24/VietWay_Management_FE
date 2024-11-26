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
import CBTemplateCard from './CB-TemplateCard';
import Pagination from '@mui/material/Pagination';
import { mockTours } from '@hooks/MockCBTourTemplate';

const ChangeBooking = ({ open, onClose, onTourSelect }) => {
    const [tours, setTours] = useState([]);
    const [filters, setFilters] = useState({ tourType: [], duration: [], location: [] });
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

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [
                    fetchedProvinces,
                    categories,
                    duration,
                ] = await Promise.all([
                    fetchProvinces({ pageSize: 63, pageIndex: 1 }),
                    fetchTourCategory(),
                    fetchTourDuration(),
                ]);

                setProvinces(fetchedProvinces.items);
                setTourCategories(categories);
                setTourDurations(duration);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        if (open) {
            fetchInitialData();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setTours(mockTours);
            setPagination(prev => ({
                ...prev,
                total: mockTours.length
            }));
        }
    }, [open]);

    const handleSearchByName = () => {
        const filteredTours = mockTours.filter(tour => 
            tour.tourName.toLowerCase().includes(tempSearchTerm.toLowerCase())
        );
        setTours(filteredTours);
        setPagination(prev => ({
            ...prev,
            pageIndex: 1,
            total: filteredTours.length
        }));
        setSearchTerm(tempSearchTerm);
    };

    const handleSearchByCode = () => {
        const filteredTours = mockTours.filter(tour => 
            tour.code.toLowerCase().includes(tempSearchCode.toLowerCase())
        );
        setTours(filteredTours);
        setPagination(prev => ({
            ...prev,
            pageIndex: 1,
            total: filteredTours.length
        }));
        setSearchCode(tempSearchCode);
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

    const startIndex = (pagination.pageIndex - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const displayedTours = tours.slice(startIndex, endIndex);

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Chọn tour thay đổi</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Search Section */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', width: '50%' }}>
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

                            <Box sx={{ display: 'flex', width: '50%' }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Tìm kiếm tour theo mã..."
                                    size="small"
                                    sx={{ mr: 1, width: '70%' }}
                                    value={tempSearchCode}
                                    onChange={(e) => setTempSearchCode(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, 'code')}
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
                                    onClick={handleSearchByCode}
                                    sx={{ backgroundColor: 'lightGray', color: 'black' }}
                                >
                                    Tìm kiếm
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Tour Cards */}
                {displayedTours.length > 0 ? (
                    <>
                        <Grid container spacing={2}>
                            {displayedTours.map((tour) => (
                                <Grid item xs={12} key={tour.tourId}>
                                    <CBTemplateCard 
                                        tour={tour}
                                        availableDates={tour.availableDates}
                                        onSelect={() => onTourSelect(tour)}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
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
            </Box>
        </Dialog>
    );
};

export default ChangeBooking;
