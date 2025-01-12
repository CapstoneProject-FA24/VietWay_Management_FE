import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourCategory, deleteTourCategory } from '@services/TourCategoryService';
import { getErrorMessage } from '@hooks/Message';
import TourCategoryReport from '@components/manager/category/TourCategoryReport';

const TourCategory = ({ searchTerm, refreshTrigger }) => {
    const [tourCategories, setTourCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [reportDialog, setReportDialog] = useState({ open: false, category: null });

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (tourCategory) => {
        setDeleteDialog({ open: true, category: tourCategory });
    };

    const handleDeleteClose = () => {
        setDeleteDialog({ open: false, category: null });
    };

    const handleDelete = async () => {
        try {
            await deleteTourCategory(deleteDialog.category.id);
            setSnackbar({
                open: true,
                message: 'Xóa loại tour thành công',
                severity: 'success'
            });
            // Refresh the list after successful deletion
            loadCategories(searchTerm);
        } catch (error) {
            console.error('Error deleting tour category:', error);
            setSnackbar({
                open: true,
                message: getErrorMessage(error),
                severity: 'error'
            });
        } finally {
            handleDeleteClose();
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleReportClick = (tourCategory) => {
        setReportDialog({ open: true, category: tourCategory });
    };

    const handleReportClose = () => {
        setReportDialog({ open: false, category: null });
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
                        {tourCategories
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((tourCategory) => (
                                <TableRow key={tourCategory.id}>
                                    <TableCell align="center">{tourCategory.id}</TableCell>
                                    <TableCell align="left">{tourCategory.name}</TableCell>
                                    <TableCell align="left">{tourCategory.description}</TableCell>
                                    <TableCell align="center">{tourCategory.displayDate}</TableCell>
                                    <TableCell align="center" sx={{ width: '18rem' }}>
                                        <Button
                                            color="error"
                                            variant="contained"
                                            onClick={() => handleDeleteClick(tourCategory)}
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            sx={{ ml: 1 }}
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleReportClick(tourCategory)}
                                        >
                                            Xem thống kê
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tourCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong ${count}`}
                />
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa loại tour "{deleteDialog.category?.name}" không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Hủy</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Report Dialog */}
            <Dialog
                open={reportDialog.open}
                onClose={handleReportClose}
                maxWidth="lg"
                fullWidth
            >
                <Box sx={{ position: 'relative' }}>
                    <Button
                        onClick={handleReportClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 1
                        }}
                    >
                        Đóng
                    </Button>
                    {reportDialog.category && (
                        <TourCategoryReport
                            categoryId={reportDialog.category.id}
                        />
                    )}
                </Box>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }} variant='filled'
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TourCategory;
