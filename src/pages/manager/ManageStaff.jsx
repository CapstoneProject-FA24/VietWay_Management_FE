import React, { useState, useEffect  } from 'react';
import { mockCompanyStaff } from '@hooks/MockAccount';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StaffUpdatePopup from '@components/manager/StaffUpdatePopup';
import StaffCreatePopup from '@components/manager/StaffCreatePopup';
import AddIcon from '@mui/icons-material/Add';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';

const ManageStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const searchTermWithoutAccents = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filteredStaff = mockCompanyStaff.filter(staff =>
    staff.fullname && staff.fullname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents.toLowerCase())
  );

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token || role !== 'quan-ly') { navigate(`/dang-nhap`); }
  }, []);

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.fullname.localeCompare(b.fullname);
    } else if (sortOrder === 'name-desc') {
      return b.fullname.localeCompare(a.fullname);
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

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Nhân viên</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '0', padding: 5, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2  }}>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm nhân viên
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm nhân viên..."
            size="small"
            sx={{ width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
              {sortedStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell sx={{ padding: '10px', textAlign: 'left' }}>{staff.id}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{staff.fullname}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{staff.phone}</TableCell>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{staff.email}</TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
                      <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: staff.status === 1 ? '#4caf50' : '#ea4747' }} />
                      <Typography sx={{ fontSize: '0.9rem' }}> {staff.status === 1 ? 'Hoạt động' : 'Đã xóa'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{new Date(staff.createDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={() => handleOpenUpdatePopup(staff)} sx={{ width: '4rem' }}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Popup components */}
        <StaffCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={(newStaff) => {
            console.log('Created Staff:', newStaff);
            setOpenCreatePopup(false);
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
      </Box>
    </Box>
  );
};

export default ManageStaff;
