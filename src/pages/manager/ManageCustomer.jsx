import React, { useState, useEffect } from 'react';
import { mockCustomer } from '@hooks/MockAccount';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment,
  MenuItem, Select, Typography, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StatusPopup from '@components/StatusPopup';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ManageCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchTermWithoutAccents = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filteredCustomers = mockCustomer.filter(customer =>
    customer.fullname && customer.fullname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aName = a.fullname || '';
    const bName = b.fullname || '';
    if (sortOrder === 'name-asc') {
      return aName.localeCompare(bName);
    } else if (sortOrder === 'name-desc') {
      return bName.localeCompare(aName);
    } else if (sortOrder === 'date-latest') {
      return new Date(b.createDate) - new Date(a.createDate);
    } else if (sortOrder === 'date-oldest') {
      return new Date(a.createDate) - new Date(b.createDate);
    }
    return 0;
  });

  const handleOpenPopup = (customer) => {
    setSelectedCustomer(customer);
    setOpenPopup(true);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>Khách hàng</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '245px' : '0', padding: isSidebarOpen ? 3 : 6, overflowY: 'auto' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm khách hàng..."
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
              <MenuItem value="date-latest">Ngày tạo mới nhất</MenuItem>
              <MenuItem value="date-oldest">Ngày tạo cũ nhất</MenuItem>
            </Select>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'left', pl: '15px', pr: '5px', pt: '7px', pb: '7px' }}>ID</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, p: '7px' }}></TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, p: '7px' }}></TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}>Ngày sinh</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}>Nơi ở</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}>Giới tính</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: !isSidebarOpen ? 'left' : 'center', padding: '7px', pl: !isSidebarOpen ? '2%' : 0 }}>Trạng thái</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: 'auto', fontWeight: 700, textAlign: 'center', p: '7px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell sx={{ pl: '15px', pr: '5px', pt: '7px', pb: '7px', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.9rem', width: isSidebarOpen ? '5.1rem' : 'auto', whiteSpace: 'normal', wordWrap: 'break-word' }}> {customer.id}</Typography>
                  </TableCell>
                  <TableCell noWrap sx={{ pt: '7px', pb: '7px', pl: '5px', pr: 0 }}>
                    <img src={customer.avatar} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                  </TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{customer.fullname}</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>{customer.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{customer.phone.length === 11 ? `${customer.phone.slice(0, 3)} ${customer.phone.slice(3, 7)} ${customer.phone.slice(7)}` : `${customer.phone.slice(0, 3)} ${customer.phone.slice(3, 6)} ${customer.phone.slice(6)}`}</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '7px' }}>{new Date(customer.DOB).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '7px' }}>{customer.liveProvince}</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '7px' }}>{customer.gender === 1 ? 'Nam' : 'Nữ'}</TableCell>
                  <TableCell sx={{ padding: '7px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
                      <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: customer.status === 1 ? '#4caf50' : '#ea4747' }} />
                      <Typography sx={{ fontSize: '0.9rem' }}> {customer.status === 1 ? 'Hoạt động' : 'Đã xóa'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: '7px', textAlign: 'center' }}>{new Date(customer.createDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: '7px' }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: customer.status === 1 ? '#ea4747' : 'green', fontSize: '0.7rem', width: '5.5rem', p: 1 }}
                      onClick={() => handleOpenPopup(customer)}
                    >
                      {customer.status === 1 ? 'Xóa' : 'Khôi phục'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <StatusPopup
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          user={selectedCustomer}
          onOpen={(id) => {
            console.log('Customer ID:', id);
            setOpenPopup(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default ManageCustomer;
