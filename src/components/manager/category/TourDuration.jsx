import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourDuration } from '@services/DurationService';

const TourDuration = ({ onDelete }) => {
    const [durations, setDurations] = useState([]);

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchTourDuration();
                const data = response.map(item => ({
                    id: item.durationId,
                    name: item.durationName,
                    dayNumber: item.dayNumber,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                }));
                setDurations(data);
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
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên thời lượng</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số ngày</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {durations.map((duration) => (
                        <TableRow key={duration.durationId}>
                            <TableCell align="center">{duration.id}</TableCell>
                            <TableCell align="center">{duration.name}</TableCell>
                            <TableCell align="center">{duration.dayNumber}</TableCell>
                            <TableCell align="center">{duration.createdAt}</TableCell>
                            <TableCell align="center">
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    onClick={() => onDelete(duration)}
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

export default TourDuration;
