import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StaffUpdatePopup from '@components/manager/staff/StaffUpdatePopup';
import StaffCreatePopup from '@components/manager/staff/StaffCreatePopup';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '@layouts/Sidebar';
import { Helmet } from 'react-helmet';
import { fetchStaff, changeStaffStatus } from '@services/StaffService';

const ManageStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    staffId: null,
    isDeleted: false,
    title: '',
    message: ''
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const result = await fetchStaff({
          pageSize,
          pageIndex: page,
          nameSearch: searchTerm,
        });
        setStaff(result.data);
        setTotalPages(Math.ceil(result.total / pageSize));
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        // Consider adding error handling UI here
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [page, pageSize, searchTerm]);

  const sortedStaff = [...staff].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.fullName.localeCompare(b.fullName);
    } else if (sortOrder === 'name-desc') {
      return b.fullName.localeCompare(a.fullName);
    }
    return 0;
  });

  const handleOpenUpdatePopup = (staff) => {
    setSelectedStaff(staff);
    setOpenUpdatePopup(true);
  };

  const handleOpenCreatePopup = () => {
    setOpenCreatePopup(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleStatusChange = (staff) => {
    setConfirmDialog({
      open: true,
      staffId: staff.staffId,
      isDeleted: !staff.isDeleted,
      title: staff.isDeleted ? 'Kích hoạt nhân viên' : 'Ngưng hoạt động nhân viên',
      message: staff.isDeleted
        ? `Bạn có chắc chắn muốn kích hoạt nhân viên ${staff.fullName}?`
        : `Bạn có chắc chắn muốn ngưng hoạt động nhân viên ${staff.fullName}?`
    });
  };

  const handleConfirmStatusChange = async () => {
    try {
      await changeStaffStatus(confirmDialog.staffId, confirmDialog.isDeleted);
      // Refresh the staff list
      const result = await fetchStaff({
        pageSize,
        pageIndex: page - 1,
        nameSearch: searchTerm,
      });
      setStaff(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Error changing staff status:', error);
      // Consider adding error handling UI here
    } finally {
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Quản lý nhân viên</title>
      </Helmet>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '0', padding: 5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant='h4' color='primary' sx={{ fontWeight: 700 }}>Nhân viên</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm nhân viên
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm nhân viên..."
              size="small"
              sx={{ width: '300px' }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
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
                <TableCell sx={{ width: '1rem', fontWeight: 700, textAlign: 'left', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '10rem', fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ width: '10rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '13rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '9rem', fontWeight: 700, textAlign: !isSidebarOpen ? 'left' : 'center', padding: '7px', pl: !isSidebarOpen ? '2%' : 0 }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No staff found</TableCell>
                </TableRow>
              ) : (
                staff.map((staff) => (
                  <TableRow key={staff.staffId}>
                    <TableCell sx={{ padding: '10px', textAlign: 'left' }}>{staff.staffId}</TableCell>
                    <TableCell noWrap sx={{ padding: '10px' }}>{staff.fullName}</TableCell>
                    <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{staff.phone}</TableCell>
                    <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{staff.email}</TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
                        <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: !staff.isDeleted ? '#4caf50' : '#ea4747' }} />
                        <Typography sx={{ fontSize: '0.9rem' }}>{!staff.isDeleted ? 'Hoạt động' : 'Đã xóa'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{new Date(staff.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                      {staff.isDeleted ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleStatusChange(staff)}
                          sx={{ width: '8rem' }}
                        >
                          Kích hoạt
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleStatusChange(staff)}
                          sx={{ width: '9rem', fontSize: '0.75rem' }}
                        >
                          Khóa tài khoản
                        </Button>
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
        <StaffCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={(newStaff) => {
            console.log('Created Staff:', newStaff);
            setOpenCreatePopup(false);
          }}
          onRefresh={() => {
            // Reload the staff list
            fetchStaff({
              pageSize,
              pageIndex: page - 1,
              nameSearch: searchTerm,
            }).then(result => {
              setStaff(result.data);
              setTotalPages(Math.ceil(result.total / pageSize));
            });
          }}
        />
        <StaffUpdatePopup
          open={openUpdatePopup}
          onClose={() => setOpenUpdatePopup(false)}
          staff={selectedStaff}
          onUpdate={(updatedStaff) => {
            console.log('Updated Staff:', updatedStaff);
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
      </Box>
    </Box>
  );
};

export default ManageStaff;
