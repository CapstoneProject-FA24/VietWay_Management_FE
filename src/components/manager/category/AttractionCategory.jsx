import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAttractionType, deleteAttractionType } from '@services/AttractionTypeService';
import AttractionCategoryReport from '@components/manager/category/AttractionCategoryReport';

const AttractionCategory = ({ searchTerm, refreshTrigger }) => {
    const [attractionCategories, setAttractionCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [reportDialog, setReportDialog] = useState({ open: false, category: null });

    useEffect(() => {
        loadCategories(searchTerm);
    }, [searchTerm, refreshTrigger]);

    const loadCategories = async (search = '') => {
        try {
            const response = await fetchAttractionType(search);  // Pass search term to service
            const data = response.map(item => ({
                id: item.attractionTypeId,
                name: item.attractionTypeName,
                description: item.description,
                createdAt: item.createdAt,
                displayDate: new Date(item.createdAt).toLocaleDateString('vi-VN')
            }));

            if (refreshTrigger) {
                setSortBy('createdAt');
                setAttractionCategories(sortCategories(data, 'createdAt'));
            } else {
                setAttractionCategories(sortCategories(data, sortBy));
            }
        } catch (error) {
            console.error('Error loading attraction categories:', error);
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
        const sortedCategories = sortCategories(attractionCategories, sortValue);
        setAttractionCategories(sortedCategories);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (attractionCategory) => {
        setCategoryToDelete(attractionCategory);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteAttractionType(categoryToDelete.id);
            loadCategories();
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting attraction category:', error);
        }
    };

    const handleReportClick = (attractionCategory) => {
        setReportDialog({ open: true, category: attractionCategory });
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
                            <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tên loại điểm đến</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miêu tả</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attractionCategories
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((attractionCategory) => (
                                <TableRow key={attractionCategory.id}>
                                    <TableCell align="center">{attractionCategory.id}</TableCell>
                                    <TableCell align="left">{attractionCategory.name}</TableCell>
                                    <TableCell align="left">{attractionCategory.description}</TableCell>
                                    <TableCell align="center">{attractionCategory.displayDate}</TableCell>
                                    <TableCell align="center" sx={{ width: '18rem' }}>
                                        <Button
                                            color="error"
                                            variant="contained"
                                            onClick={() => handleDeleteClick(attractionCategory)}
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            sx={{ ml: 1 }}
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleReportClick(attractionCategory)}
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
                    count={attractionCategories.length}
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
                        Bạn có chắc chắn muốn xóa loại điểm đến này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

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
                        <AttractionCategoryReport
                            categoryId={reportDialog.category.id}
                        />
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default AttractionCategory;
