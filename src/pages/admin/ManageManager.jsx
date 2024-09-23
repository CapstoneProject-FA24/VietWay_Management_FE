import React, { useState } from 'react';
import { mockManager } from '@hooks/MockAccount';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ManagerUpdatePopup from '@components/admin/ManagerUpdatePopup';
import ManagerCreatePopup from '@components/admin/ManagerCreatePopup';
import CustomerActivatePopup from '@components/manager/CustomerActivatePopup';
import CustomerDeactivatePopup from '@components/manager/CustomerDeactivatePopup';
import AddIcon from '@mui/icons-material/Add';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Sidebar from '@layouts/Sidebar';

const ManageManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openActivatePopup, setOpenActivatePopup] = useState(false);
  const [openDeactivatePopup, setOpenDeactivatePopup] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const searchTermWithoutAccents = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filteredManagers = mockManager.filter(manager =>
    manager.fullname && manager.fullname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents.toLowerCase())
  );

  const sortedManagers = [...filteredManagers].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.fullname.localeCompare(b.fullname);
    } else if (sortOrder === 'name-desc') {
      return b.fullname.localeCompare(a.fullname);
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

  const handleOpenActivatePopup = (manager) => {
    setSelectedManager(manager);
    setOpenActivatePopup(true);
  };

  const handleOpenDeactivatePopup = (manager) => {
    setSelectedManager(manager);
    setOpenDeactivatePopup(true);
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.5s', marginLeft: isSidebarOpen ? '250px' : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: isSidebarOpen ? '102%': '125%' }}>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm quản lý
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: isSidebarOpen ? '102%': '125%' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm quản lý..."
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
                <TableCell sx={{ width: '5%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '14%', fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ width: '12%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '18%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Mật khẩu</TableCell> {/* Added Password Column */}
                <TableCell sx={{ width: '15%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '11%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{manager.id}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{manager.fullname}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{manager.phone}</TableCell>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{manager.email}</TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                    {showPassword ? manager.pass : '••••••••'} {/* Ẩn hoặc hiển thị mật khẩu */}
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />} {/* Nút show/hide */}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: manager.status === 1 ? 'green' : 'red', padding: '10px', textAlign: 'center' }}>
                    {manager.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{new Date(manager.createDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={() => handleOpenUpdatePopup(manager)} sx={{ width: '9rem' }}>Sửa</Button>
                    {manager.status === 1 ? (
                      <Button variant="contained" sx={{ backgroundColor: 'red', mt: 0.5, width: '9rem' }} onClick={() => handleOpenDeactivatePopup(manager)}>Vô hiệu hóa</Button>
                    ) : (
                      <Button variant="contained" sx={{ backgroundColor: 'green', mt: 0.5, width: '9rem' }} onClick={() => handleOpenActivatePopup(manager)}>Kích hoạt</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Popup for creating manager */}
        <ManagerCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={(newManager) => {
            console.log('Created Manager:', newManager);
            setOpenCreatePopup(false);
          }}
        />
        {/* Popup for updating manager */}
        <ManagerUpdatePopup
          open={openUpdatePopup}
          onClose={() => setOpenUpdatePopup(false)}
          manager={selectedManager}
          onUpdate={(updatedManager) => {
            console.log('Updated Manager:', updatedManager);
            setOpenUpdatePopup(false);
          }}
        />
        {/* Popup for activating manager */}
        <CustomerActivatePopup
          open={openActivatePopup}
          onClose={() => setOpenActivatePopup(false)}
          user={selectedManager}
          onActivate={(id) => {
            console.log('Activated Manager ID:', id);
            setOpenActivatePopup(false);
          }}
        />
        {/* Popup for deactivating manager */}
        <CustomerDeactivatePopup
          open={openDeactivatePopup}
          onClose={() => setOpenDeactivatePopup(false)}
          user={selectedManager}
          onDeactivate={(id) => {
            console.log('Deactivated Manager ID:', id);
            setOpenDeactivatePopup(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default ManageManager;
