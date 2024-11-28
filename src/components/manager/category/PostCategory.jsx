import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPostCategory, deletePostCategory } from '@services/PostCategoryService';

const PostCategory = ({ searchTerm, refreshTrigger }) => {
    const [postCategories, setPostCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const loadCategories = async (search = '') => {
        try {
            const response = await fetchPostCategory(search);
            const data = response.map(item => ({
                id: item.postCategoryId,
                name: item.name,
                description: item.description,
                createdAt: item.createdAt,
                displayDate: new Date(item.createdAt).toLocaleDateString('vi-VN')
            }));
            
            if (refreshTrigger) {
                setSortBy('createdAt');
                setPostCategories(sortCategories(data, 'createdAt'));
            } else {
                setPostCategories(sortCategories(data, sortBy));
            }
        } catch (error) {
            console.error('Error loading post categories:', error);
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
        const sortedCategories = sortCategories(postCategories, sortValue);
        setPostCategories(sortedCategories);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (postCategory) => {
        setCategoryToDelete(postCategory);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deletePostCategory(categoryToDelete.id);
            loadCategories(searchTerm);
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting post category:', error);
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
                    <MenuItem value="createdAt">Mới nhất</MenuItem>
                </Select>
            </FormControl>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Mã</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tên loại bài viết</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Miêu tả</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {postCategories
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((postCategory) => (
                                <TableRow key={postCategory.id}>
                                    <TableCell align="center">{postCategory.id}</TableCell>
                                    <TableCell align="left">{postCategory.name}</TableCell>
                                    <TableCell align="left">{postCategory.description}</TableCell>
                                    <TableCell align="center">{postCategory.displayDate}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            color="error"
                                            onClick={() => handleDeleteClick(postCategory)}
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
                    count={postCategories.length}
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
                        Bạn có chắc chắn muốn xóa loại bài viết này không?
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

export default PostCategory;
