import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAttractionType } from '@services/AttractionTypeService';

const AttractionCategory = ({ onDelete }) => {
    const [attractionCategories, setAttractionCategories] = useState([]);

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchAttractionType();
                const data = response.map(item => ({
                    id: item.attractionTypeId,
                    name: item.attractionTypeName,
                    description: item.description,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                }));
                setAttractionCategories(data);
            } catch (error) {
                console.error('Error loading attraction categories:', error);
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
                        <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tên loại điểm đến</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miêu tả</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attractionCategories.map((attractionCategory) => (
                        <TableRow key={attractionCategory.attractionCategoryId}>
                            <TableCell align="center">{attractionCategory.id}</TableCell>
                            <TableCell align="left">{attractionCategory.name}</TableCell>
                            <TableCell align="left">{attractionCategory.description}</TableCell>
                            <TableCell align="center">{attractionCategory.createdAt}</TableCell>
                            <TableCell align="center">
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => onDelete(attractionCategory)}
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

export default AttractionCategory;
