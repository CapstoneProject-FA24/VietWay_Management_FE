import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourDuration, deleteTourDuration } from '@services/DurationService';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const TourDuration = ({ searchTerm, refreshTrigger }) => {
    const [durations, setDurations] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [durationToDelete, setDurationToDelete] = useState(null);

    useEffect(() => {
        loadDurations(searchTerm);
    }, [searchTerm, refreshTrigger]);

    const loadDurations = async (search = '') => {
        try {
            const response = await fetchTourDuration(search);
            const data = response.map(item => ({
                id: item.durationId,
                name: item.durationName,
                dayNumber: item.dayNumber,
                createdAt: item.createdAt,
                displayDate: new Date(item.createdAt).toLocaleDateString('vi-VN')
            }));
            
            if (refreshTrigger) {
                setSortBy('createdAt');
                setDurations(sortDurations(data, 'createdAt'));
            } else {
                setDurations(sortDurations(data, sortBy));
            }
        } catch (error) {
            console.error('Error loading tour durations:', error);
        }
    };

    const sortDurations = (durations, sortValue) => {
        return [...durations].sort((a, b) => {
            if (sortValue === 'id') {
                return a.id - b.id;
            } else if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'dayNumber') {
                return a.dayNumber - b.dayNumber;
            } else if (sortValue === 'createdAt') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });
    };

    useEffect(() => {
        loadDurations(searchTerm);
    }, [searchTerm, refreshTrigger]);

    const handleSort = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        const sortedDurations = sortDurations(durations, sortValue);
        setDurations(sortedDurations);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (duration) => {
        setDurationToDelete(duration);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteTourDuration(durationToDelete.id);
            loadDurations();
            setDeleteConfirmOpen(false);
            setDurationToDelete(null);
        } catch (error) {
            console.error('Error deleting tour duration:', error);
        }
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
                    <MenuItem value="createdAt">Mới nhất</MenuItem>
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
                        {durations
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((duration) => (
                                <TableRow key={duration.durationId}>
                                    <TableCell align="center">{duration.id}</TableCell>
                                    <TableCell align="center">{duration.name}</TableCell>
                                    <TableCell align="center">{duration.dayNumber}</TableCell>
                                    <TableCell align="center">{duration.displayDate}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            color="error"
                                            onClick={() => handleDeleteClick(duration)}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={durations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong ${count}`}
                />
            </TableContainer>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa thời lượng tour này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TourDuration;
