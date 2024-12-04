import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment,
  Typography, Pagination, Snackbar, Alert, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { fetchCustomer, changeCustomerStatus } from '@services/CustomerService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ManageCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    customerId: null,
    currentStatus: null
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetchCustomer({
        pageSize,
        pageIndex: page,
        nameSearch: searchQuery
      });
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      console.error('Error fetching customers:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách khách hàng',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, searchQuery]);

  const handleStatusChangeClick = (customerId, currentStatus) => {
    setConfirmDialog({
      open: true,
      customerId,
      currentStatus
    });
  };

  const handleConfirmStatusChange = async () => {
    try {
      const { customerId, currentStatus } = confirmDialog;
      await changeCustomerStatus(customerId, !currentStatus);
      setSnackbar({
        open: true,
        message: `${currentStatus ? 'Vô hiệu hóa' : 'Kích hoạt'} tài khoản thành công`,
        severity: 'success'
      });
      fetchCustomers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi thay đổi trạng thái tài khoản',
        severity: 'error'
      });
    } finally {
      setConfirmDialog({ open: false, customerId: null, currentStatus: null });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Quản lý khách hàng</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '245px' : '0', padding: isSidebarOpen ? 3 : 6, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 3 }}>
          <Typography variant='h3' color='primary' sx={{ fontWeight: 700 }}>Quản lý khách hàng</Typography>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm khách hàng..."
            size="small"
            sx={{ width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Họ tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số điện thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell>{customer.customerId}</TableCell>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: customer.isDeleted ? '#ea4747' : '#4caf50' }} />
                      <Typography>{customer.isDeleted ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={customer.isDeleted ? "success" : "error"}
                      onClick={() => handleStatusChangeClick(customer.customerId, customer.isDeleted)}
                    >
                      {customer.isDeleted ? 'Kích hoạt' : 'Vô hiệu hóa'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, customerId: null, currentStatus: null })}
        >
          <DialogTitle>
            {confirmDialog.currentStatus ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDialog.currentStatus
                ? 'Bạn có chắc chắn muốn kích hoạt tài khoản này?'
                : 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setConfirmDialog({ open: false, customerId: null, currentStatus: null })}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmStatusChange}
              variant="contained"
              color={confirmDialog.currentStatus ? "success" : "error"}
              autoFocus
            >
              {confirmDialog.currentStatus ? 'Kích hoạt' : 'Vô hiệu hóa'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant='filled'
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageCustomer;
