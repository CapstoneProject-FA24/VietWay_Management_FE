import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourCategory } from '@services/TourCategoryService';

const TourCategory = ({ onDelete }) => {
    const [tourCategories, setTourCategories] = useState([]);

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchTourCategory();
                const data = response.map(item => ({
                    id: item.tourCategoryId,
                    name: item.tourCategoryName,
                    description: item.description,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                }));
                setTourCategories(data);
            } catch (error) {
                console.error('Error loading tour durations:', error);
            }
        };
        loadDurations();
    }, []);

    return (
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
                        <TableRow key={tourCategory.tourCategoryId}>
                            <TableCell align="center">{tourCategory.id}</TableCell>
                            <TableCell align="left">{tourCategory.name}</TableCell>
                            <TableCell align="left">{tourCategory.description}</TableCell>
                            <TableCell align="center">{tourCategory.createdAt}</TableCell>
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
    );
};

export default TourCategory;
