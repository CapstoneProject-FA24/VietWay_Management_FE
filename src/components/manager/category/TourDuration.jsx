import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourDuration } from '@services/DurationService';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TourDuration = ({ onDelete }) => {
    const [durations, setDurations] = useState([]);
    const [sortBy, setSortBy] = useState('id');

    useEffect(() => {
        const loadDurations = async () => {
            try {
                const response = await fetchTourDuration();
                const data = response.map(item => ({
                    id: item.durationId,
                    name: item.durationName,
                    dayNumber: item.dayNumber,
                    createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN')
                })).sort((a, b) => a.id - b.id);
                setDurations(data);
            } catch (error) {
                console.error('Error loading tour durations:', error);
            }
        };
        loadDurations();
    }, []);

    const handleSort = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        
        const sortedDurations = [...durations].sort((a, b) => {
            if (sortValue === 'id') {
                return a.id - b.id;
            } else if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'dayNumber') {
                return a.dayNumber - b.dayNumber;
            }
            return 0;
        });
        
        setDurations(sortedDurations);
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
                    <MenuItem value="dayNumber">Số ngày</MenuItem>
                </Select>
            </FormControl>

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
        </>
    );
};

export default TourDuration;
