import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourCategory } from '@services/TourCategoryService';

const TourCategory = ({ onDelete, searchTerm, refreshTrigger }) => {
    const [tourCategories, setTourCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [isLoading, setIsLoading] = useState(false);

    const loadCategories = async (search = '') => {
        try {
            setIsLoading(true);
            const response = await fetchTourCategory(search);
            const data = response.map(item => ({
                id: item.tourCategoryId,
                name: item.tourCategoryName,
                description: item.description,
                createdAt: item.createdAt,
                displayDate: new Date(item.createdAt).toLocaleDateString('vi-VN')
            }));
            
            if (refreshTrigger) {
                setSortBy('createdAt');
                setTourCategories(sortCategories(data, 'createdAt'));
            } else {
                setTourCategories(sortCategories(data, sortBy));
            }
        } catch (error) {
            console.error('Error loading tour categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortCategories = (categories, sortValue) => {
        return [...categories].sort((a, b) => {
            if (sortValue === 'id') {
                return a.id - b.id;
            } else if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'createdAt') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });
    };

    useEffect(() => {
        loadCategories(searchTerm);
    }, [searchTerm, refreshTrigger]);

    const handleSort = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        const sortedCategories = sortCategories(tourCategories, sortValue);
        setTourCategories(sortedCategories);
    };

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120, mb: 2, float: 'right' }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                    value={sortBy}
                    label="Sắp xếp theo"
                    onChange={handleSort}
                >
                    <MenuItem value="id">Mã A-Z</MenuItem>
                    <MenuItem value="name">Tên A-Z</MenuItem>
                    <MenuItem value="createdAt">Mới nhất</MenuItem>
                </Select>
            </FormControl>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Mã</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên loại tour</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miêu tả</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tourCategories.map((tourCategory) => (
                            <TableRow key={tourCategory.id}>
                                <TableCell align="center">{tourCategory.id}</TableCell>
                                <TableCell align="left">{tourCategory.name}</TableCell>
                                <TableCell align="left">{tourCategory.description}</TableCell>
                                <TableCell align="center">{tourCategory.displayDate}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => onDelete(tourCategory)}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TourCategory;
