import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchEventCategory } from '@services/EventCategoryService';

const EventCategory = ({ onDelete }) => {
    const [eventCategories, setEventCategories] = useState([]);

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchEventCategory();
                const data = response.map(item => ({
                    id: item.eventCategoryId,
                    name: item.name,
                    description: item.description,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                }));
                setEventCategories(data);
            } catch (error) {
                console.error('Error loading event categories:', error);
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
                        <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tên loại sự kiện</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miêu tả</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eventCategories.map((eventCategory) => (
                        <TableRow key={eventCategory.eventCategoryId}>
                            <TableCell align="center">{eventCategory.id}</TableCell>
                            <TableCell align="left">{eventCategory.name}</TableCell>
                            <TableCell align="left">{eventCategory.description}</TableCell>
                            <TableCell align="center">{eventCategory.createdAt}</TableCell>
                            <TableCell align="center">
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => onDelete(eventCategory)}
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

export default EventCategory;
