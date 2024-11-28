import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Pagination, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ManagerUpdatePopup from '@components/admin/ManagerUpdatePopup';
import ManagerCreatePopup from '@components/admin/ManagerCreatePopup';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '@layouts/Sidebar';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { fetchManager, changeManagerStatus } from '@services/ManagerService';

const ManageManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    managerId: null,
    isDeleted: false,
    title: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const loadManagers = async () => {
      setIsLoading(true);
      try {
        const result = await fetchManager({
          pageSize,
          pageIndex,
          nameSearch: searchTerm
        });
        setManagers(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        // Consider adding error handling/notification here
      } finally {
        setIsLoading(false);
      }
    };

    loadManagers();
  }, [pageSize, pageIndex, searchTerm]);

  const sortedManagers = [...managers].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.fullName.localeCompare(b.fullName);
    } else if (sortOrder === 'name-desc') {
      return b.fullName.localeCompare(a.fullName);
    }
    return 0;
  });

  const handleOpenUpdatePopup = (manager) => {
    setSelectedManager(manager);
    setOpenUpdatePopup(true);
  };

  const handleOpenCreatePopup = () => {
    setOpenCreatePopup(true);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
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
      // Refresh the manager list
      const result = await fetchManager({
        pageSize,
        pageIndex,
        nameSearch: searchTerm,
      });
      setManagers(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error changing manager status:', error);
    } finally {
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  const refreshData = async () => {
    try {
      const result = await fetchManager({
        pageSize,
        pageIndex,
        nameSearch: searchTerm
      });
      setManagers(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePageChange = (event, newPage) => {
    setPageIndex(newPage);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Quản lý nhân viên quản lý</title>
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '0', padding: 5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
            </Select>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '3rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '12rem', fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ width: '11rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '16rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '10rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '7rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedManagers.map((manager) => (
                <TableRow key={manager.managerId}>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{manager.managerId}</TableCell>
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
                        color="primary"
                        onClick={() => handleStatusChange(manager)}
                        sx={{ width: '8rem' }}
                      >
                        Kích hoạt
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusChange(manager)}
                        sx={{ width: '9rem', fontSize: '0.75rem' }}
                      >
                        Khóa tài khoản
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>
            Hiển thị {managers.length} trên tổng số {total} kết quả
          </Typography>
          <Stack spacing={2}>
            <Pagination 
              count={Math.ceil(total / pageSize)} 
              page={pageIndex}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
        <ManagerCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={(newManager) => {
            setSnackbar({
              open: true,
              message: 'Tạo quản lý thành công',
              severity: 'success'
            });
            setOpenCreatePopup(false);
          }}
          onRefresh={refreshData}
        />
        <ManagerUpdatePopup
          open={openUpdatePopup}
          onClose={() => setOpenUpdatePopup(false)}
          manager={selectedManager}
          onUpdate={(updatedManager) => {
            console.log('Updated Manager:', updatedManager);
            setOpenUpdatePopup(false);
          }}
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
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
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
