import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAttractionType } from '@services/AttractionTypeService';

const AttractionCategory = ({ onDelete }) => {
    const [attractionCategories, setAttractionCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchAttractionType();
                const data = response.map(item => ({
                    id: item.attractionTypeId,
                    name: item.attractionTypeName,
                    description: item.description,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                })).sort((a, b) => a.id - b.id);
                setAttractionCategories(data);
            } catch (error) {
                console.error('Error loading attraction categories:', error);
            }
        };
        loadDurations();
    }, []);

    const handleSort = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        
        const sortedCategories = [...attractionCategories].sort((a, b) => {
            if (sortValue === 'id') {
                return a.id - b.id;
            } else if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
        
        setAttractionCategories(sortedCategories);
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
                </Select>
            </FormControl>

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
        </>
    );
};

export default AttractionCategory;
