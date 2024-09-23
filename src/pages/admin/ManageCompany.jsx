import React, { useState } from 'react';
import { mockCompany } from '@hooks/MockCompany';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, InputAdornment, MenuItem, Select, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CompanyUpdatePopup from '@components/admin/CompanyUpdatePopup';
import CompanyCreatePopup from '@components/admin/CompanyCreatePopup'; // Import the create popup
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '@layouts/Sidebar';

const ManageCompany = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc'); // New state for sorting
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false); // State for create popup
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar open/close

  const searchTermWithoutAccents = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filteredCompanies = mockCompany.filter(company =>
    company.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTermWithoutAccents.toLowerCase())
  );

  // Sorting function
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === 'date-latest') {
      return new Date(b.createDate) - new Date(a.createDate);
    } else if (sortOrder === 'date-oldest') {
      return new Date(a.createDate) - new Date(b.createDate);
    }
    return 0;
  });

  const handleUpdateCompany = (updatedCompany) => {
    console.log('Updated Company:', updatedCompany);
  };

  const handleOpenUpdatePopup = (company) => {
    setSelectedCompany(company);
    setOpenUpdatePopup(true);
  };

  const handleOpenCreatePopup = () => {
    setOpenCreatePopup(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenCreatePopup} startIcon={<AddIcon />}>
            Thêm công ty
          </Button>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            </Select>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '3%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>ID</TableCell>
                <TableCell sx={{ width: '5%', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
                <TableCell sx={{ width: '14%', fontWeight: 700, padding: '10px' }}>Tên công ty</TableCell>
                <TableCell sx={{ width: '12%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Số điện thoại</TableCell>
                <TableCell sx={{ width: '18%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Email</TableCell>
                <TableCell sx={{ width: '30%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Địa chỉ</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Website</TableCell>
                <TableCell sx={{ width: '8%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Trạng thái</TableCell>
                <TableCell sx={{ width: '16%', fontWeight: 700, textAlign: 'center', padding: '10px' }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 700, textAlign: 'center', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell sx={{ padding: '10px', textAlign: 'center' }}>{company.id}</TableCell>
                  <TableCell sx={{ padding: '10px' }}>
                    <img src={company.imageUrl} alt={company.name} style={{ width: '50px', height: '50px' }} />
                  </TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{company.name}</TableCell>
                  <TableCell noWrap sx={{ padding: '10px' }}>{company.phone.length === 11 ? `${company.phone.slice(0, 3)} ${company.phone.slice(3, 7)} ${company.phone.slice(7)}` : `${company.phone.slice(0, 3)} ${company.phone.slice(3, 6)} ${company.phone.slice(6)}`}</TableCell>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '12ch', padding: '10px' }}>{company.email}</TableCell>
                  <TableCell sx={{ padding: '10px' }}>{company.address}</TableCell>
                  <TableCell sx={{ padding: '10px' }}>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website.length > 10 ? `${company.website.substring(0, 16)}...` : company.website}
                    </a>
                  </TableCell>
                  <TableCell sx={{ color: company.status === 1 ? 'green' : 'red', padding: '10px' }}>
                    {company.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </TableCell>
                  <TableCell sx={{ padding: '10px' }}>{new Date(company.createDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ padding: '10px' }}>
                    <Button variant="contained" color="primary" onClick={() => handleOpenUpdatePopup(company)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Popup for creating company */}
        <CompanyCreatePopup
          open={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          onCreate={(newCompany) => {
            console.log('Created Company:', newCompany);
            setOpenCreatePopup(false);
          }}
        />
        {/* Popup for updating company */}
        <CompanyUpdatePopup
          open={openUpdatePopup}
          onClose={() => setOpenUpdatePopup(false)}
          company={selectedCompany}
          onUpdate={handleUpdateCompany}
        />
      </Box>
    </Box>
  );
};

export default ManageCompany;
