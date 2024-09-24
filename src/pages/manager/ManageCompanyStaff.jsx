import React, { useState } from 'react';
import { mockCompanyStaff } from '@hooks/MockAccount';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StaffUpdatePopup from '@components/manager/StaffUpdatePopup';
import StaffCreatePopup from '@components/manager/StaffCreatePopup';
import AddIcon from '@mui/icons-material/Add';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SidebarManager from '@layouts/SidebarManager';

const ManageCompanyStaff = () => {
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
    <Box sx={{ width: '100%', display: 'flex' }}>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.5s', marginLeft: isSidebarOpen ? '250px' : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: isSidebarOpen ? '102%': '125%' }}>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm nhân viên
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: isSidebarOpen ? '102%': '125%' }}>
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
        <TableContainer component={Paper} sx={{ width: isSidebarOpen ? '102%': '125%' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '1rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '11rem', fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ width: '10rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Công ty</TableCell>
                <TableCell sx={{ width: '7rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '12rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                {/*<TableCell sx={{ width: '8.5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Mật khẩu</TableCell>*/}
                <TableCell sx={{ width: '9rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '5rem', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{staff.id}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{staff.fullname}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{staff.company}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{staff.phone}</TableCell>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{staff.email}</TableCell>
                  {/*
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                    {showPassword ? staff.pass : '••••••••'}
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </TableCell>
                  */}
                  <TableCell sx={{ color: staff.status === 1 ? 'green' : 'red', padding: '10px', textAlign: 'center' }}>
                    {staff.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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

export default ManageCompanyStaff;
