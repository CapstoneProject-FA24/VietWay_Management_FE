import React, { useState } from 'react';
import { mockCustomer } from '@hooks/MockAccount'; // Update import to use mockCustomer
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomerActivatePopup from '@components/manager/CustomerActivatePopup'; // Import the activate popup
import CustomerDeactivatePopup from '@components/manager/CustomerDeactivatePopup'; // Import the deactivate popup
import Sidebar from '@layouts/Sidebar';

const ManageCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc'); // New state for sorting
  const [openActivatePopup, setOpenActivatePopup] = useState(false); // State for activate popup
  const [openDeactivatePopup, setOpenDeactivatePopup] = useState(false); // State for deactivate popup
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Renamed to selectedCustomer
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const searchTermWithoutAccents = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filteredCustomers = mockCustomer.filter(customer =>
    customer.fullname && customer.fullname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents.toLowerCase())
  );

  // Sorting function
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

  const handleOpenActivatePopup = (customer) => {
    setSelectedCustomer(customer);
    setOpenActivatePopup(true);
  };

  const handleOpenDeactivatePopup = (customer) => {
    setSelectedCustomer(customer);
    setOpenDeactivatePopup(true);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.5s', marginLeft: isSidebarOpen ? '250px' : 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: isSidebarOpen ? '117%' : '141%' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm công ty..."
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
        <TableContainer component={Paper} sx={{ width: isSidebarOpen ? '117%' : '141%' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '1%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 700, padding: '10px' }}>Họ tên</TableCell>
                <TableCell sx={{ width: '14%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '11%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày sinh</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Giới tính</TableCell>
                <TableCell sx={{ width: '11%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '8%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '8%', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{customer.id}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{customer.fullname}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px', textAlign: 'center' }}>{customer.phone.length === 11 ? `${customer.phone.slice(0, 3)} ${customer.phone.slice(3, 7)} ${customer.phone.slice(7)}` : `${customer.phone.slice(0, 3)} ${customer.phone.slice(3, 6)} ${customer.phone.slice(6)}`}</TableCell>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '15px' }}>{customer.email}</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '10px' }}>{new Date(customer.DOB).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '10px' }}>{customer.gender === 1 ? 'Nam' : 'Nữ'}</TableCell>
                  <TableCell sx={{ color: customer.status === 1 ? 'green' : 'red', padding: '10px', textAlign: 'center' }}>
                    {customer.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </TableCell>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{new Date(customer.createDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: '10px' }}>
                    {customer.status === 1 ? (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'red', fontSize: '0.7rem', width: '7rem' }}
                        onClick={() => handleOpenDeactivatePopup(customer)}
                      >
                        Vô hiệu hóa
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'primary.main', fontSize: '0.7rem', width: '7rem' }}
                        onClick={() => handleOpenActivatePopup(customer)}
                      >
                        Khôi phục
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomerActivatePopup
          open={openActivatePopup}
          onClose={() => setOpenActivatePopup(false)}
          user={selectedCustomer}
          onActivate={(id) => {
            console.log('Activated Customer ID:', id);
            setOpenActivatePopup(false);
          }}
        />
        <CustomerDeactivatePopup
          open={openDeactivatePopup}
          onClose={() => setOpenDeactivatePopup(false)}
          user={selectedCustomer}
          onDeactivate={(id) => {
            console.log('Deactivated Customer ID:', id);
            setOpenDeactivatePopup(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default ManageCustomer;
