import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ManagerCreatePopup from '@components/admin/ManagerCreatePopup';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '@layouts/Sidebar';
import { Helmet } from 'react-helmet';
import { fetchManager, changeManagerStatus, adminResetManagerPassword } from '@services/ManagerService';

const ManageManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    managerId: null,
    isDeleted: false,
    title: '',
    message: ''
  });
  const [resetPasswordDialog, setResetPasswordDialog] = useState({
    open: false,
    managerId: null,
    managerName: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadManagers = async () => {
    setLoading(true);
    try {
      const result = await fetchManager({
        pageSize,
        pageIndex: page,
        nameSearch: searchTerm,
      });
      setManagers(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Failed to fetch managers:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách quản lý',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, [page, pageSize, searchTerm]);

  const sortedManagers = [...managers].sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.fullName.localeCompare(b.fullName);
      case 'name-desc':
        return b.fullName.localeCompare(a.fullName);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleOpenCreatePopup = () => {
    setOpenCreatePopup(true);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (manager) => {
    setConfirmDialog({
      open: true,
      managerId: manager.managerId,
      isDeleted: !manager.isDeleted,
      title: manager.isDeleted ? 'Kích hoạt quản lý' : 'Ngưng hoạt động quản lý',
      message: manager.isDeleted
        ? `Bạn có chắc chắn muốn kích hoạt quản lý ${manager.fullName}?`
        : `Bạn có chắc chắn muốn ngưng hoạt động quản lý ${manager.fullName}?`
    });
  };

  const handleConfirmStatusChange = async () => {
    try {
      await changeManagerStatus(confirmDialog.managerId, confirmDialog.isDeleted);
      await loadManagers();
      setSnackbar({
        open: true,
        message: confirmDialog.isDeleted ? 'Khóa tài khoản thành công' : 'Kích hoạt tài khoản thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error changing manager status:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái quản lý',
        severity: 'error'
      });
    } finally {
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  const handleResetPasswordClick = (manager) => {
    setResetPasswordDialog({
      open: true,
      managerId: manager.managerId,
      managerName: manager.fullName
    });
  };

  const handleConfirmResetPassword = async () => {
    try {
      await adminResetManagerPassword(resetPasswordDialog.managerId);
      setSnackbar({
        open: true,
        message: 'Đặt lại mật khẩu thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu',
        severity: 'error'
      });
    } finally {
      setResetPasswordDialog(prev => ({ ...prev, open: false }));
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCreateSuccess = (newManager) => {
    setOpenCreatePopup(false);
    setPage(1);
    setSortOrder('date-desc');
    setSearchTerm('');
    setSearchInput('');
    loadManagers();
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Quản lý nhân viên quản lý</title>
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '0', padding: 5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant='h4' color='primary' sx={{ fontWeight: 700 }}>Quản lý</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm quản lý
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm quản lý..."
              size="small"
              sx={{ width: '300px' }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: '100px' }}
            >
              Tìm kiếm
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              Sắp xếp theo
            </Typography>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
              sx={{ width: '200px', ml: 2 }}
            >
              <MenuItem value="name-asc">Tên A-Z</MenuItem>
              <MenuItem value="name-desc">Tên Z-A</MenuItem>
              <MenuItem value="date-asc">Ngày tạo cũ nhất</MenuItem>
              <MenuItem value="date-desc">Ngày tạo mới nhất</MenuItem>
            </Select>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'left', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '14rem', fontWeight: 700, textAlign: 'left', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '7rem', fontWeight: 700, textAlign: 'left', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : managers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Không tìm thấy quản lý</TableCell>
                </TableRow>
              ) : (
                sortedManagers.map((manager) => (
                  <TableRow key={manager.managerId}>
                    <TableCell sx={{ padding: '10px', textAlign: 'left' }}>{manager.managerId}</TableCell>
                    <TableCell noWrap sx={{ padding: '10px' }}>{manager.fullName}</TableCell>
                    <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{manager.phone}</TableCell>
                    <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{manager.email}</TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
                        <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: !manager.isDeleted ? '#4caf50' : '#ea4747' }} />
                        <Typography sx={{ fontSize: '0.9rem' }}>{!manager.isDeleted ? 'Hoạt động' : 'Đã xóa'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{new Date(manager.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                      {manager.isDeleted ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleStatusChange(manager)}
                          sx={{ width: '9.3rem', fontSize: '0.75rem' }}
                        >
                          Kích hoạt
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleStatusChange(manager)}
                            sx={{ width: '9.3rem', fontSize: '0.75rem' }}
                          >
                            Khóa tài khoản
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleResetPasswordClick(manager)}
                            sx={{ width: '9.3rem', fontSize: '0.75rem' }}
                          >
                            Đặt lại mật khẩu
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ flexGrow: 1 }} />
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            variant="outlined"
            sx={{ height: '40px', ml: 2 }}
          >
            <MenuItem value={5}>5 / trang</MenuItem>
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
            <MenuItem value={50}>50 / trang</MenuItem>
          </Select>
        </Box>

        <ManagerCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={handleCreateSuccess}
          onRefresh={loadManagers}
        />

        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            {confirmDialog.message}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
              color="inherit"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              color={confirmDialog.isDeleted ? "error" : "primary"}
              variant="contained"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={resetPasswordDialog.open}
          onClose={() => setResetPasswordDialog(prev => ({ ...prev, open: false }))}
        >
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn đặt lại mật khẩu cho quản lý {resetPasswordDialog.managerName}?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setResetPasswordDialog(prev => ({ ...prev, open: false }))}
              color="inherit"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmResetPassword}
              color="primary"
              variant="contained"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageManager;
