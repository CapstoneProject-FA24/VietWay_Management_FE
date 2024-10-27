import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, IconButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)(({ theme, isopen }) => ({
  backgroundColor: 'white',
  boxShadow: theme.shadows[1],
  position: 'fixed',
  left: isopen ? 0 : '-250px',
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  zIndex: 1200,
  width: '250px',
  transition: 'left 0.3s',
}));

const ToggleButton = styled(Paper)(({ theme, isopen }) => ({
  position: 'fixed',
  width: '30px',
  height: '40px',
  borderRadius: '5px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '12px',
  marginLeft: isopen ? '-35px' : '-5px',
  left: isopen ? '250px' : '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1300,
  transition: 'left 0.3s , margin-left 0.3s',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LogoLink = styled(Link)(({ theme }) => ({
  marginBottom: '30px',
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

const MenuItemPaper = styled(Paper)(({ theme, isSelected }) => ({
  width: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: isSelected ? '#e3f2fd' : 'white',
  '&:hover': { backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5' },
}));

const MenuItemPaper2 = styled(Paper)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '12px',
  '&:hover': { backgroundColor: '#f5f5f5' },
}));

const MenuItemBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
}));

const SidebarManager = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    navigate('/dang-nhap');
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} isopen={isOpen}>
        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </ToggleButton>

      <SidebarContainer isopen={isOpen}>
        <LogoLink to="/">
          <img src="/logo2_color.png" alt="VIETWAY" style={{ height: '55px' }} />
        </LogoLink>

        <Divider />

        <List sx={{ width: '100%' }}>
          <ListItem 
            component={Link} 
            to="/admin/dashboard" 
            sx={{ textDecoration: 'none', color: 'inherit', padding: 0, marginTop: 1 }}
          >
            <MenuItemPaper elevation={2} isSelected={location.pathname === '/admin/dashboard'}>
              <MenuItemBox>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <HomeIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }}
                />
              </MenuItemBox>
            </MenuItemPaper>
          </ListItem>
        </List>

        <List sx={{ width: '100%' }}>
          {[
            { text: 'Điểm tham quan', url: '/quan-ly/diem-tham-quan', icon: <LocationOnIcon /> },
            { text: 'Tour mẫu', url: '/quan-ly/tour-mau', icon: <MapIcon /> },
            { text: 'Tour du lịch', url: '/quan-ly/tour-du-lich', icon: <DirectionsBusIcon /> },
            { text: 'Nhân viên', url: '/quan-ly/nhan-vien', icon: <PeopleIcon /> },
            { text: 'Khách hàng', url: '/quan-ly/khach-hang', icon: <PersonIcon /> }
          ].map(({ text, url, icon }) => (
            <ListItem 
              key={text}
              component={Link} 
              to={url}
              sx={{ textDecoration: 'none', color: 'inherit', padding: 0 }}
            >
              <MenuItemPaper elevation={0} isSelected={location.pathname === url}>
                <MenuItemBox>
                  <MenuItemPaper2 elevation={1}>
                    {React.cloneElement(icon, { sx: { color: '#2196f3' } })}
                  </MenuItemPaper2>
                  <ListItemText 
                    primary={text} 
                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                  />
                </MenuItemBox>
              </MenuItemPaper>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />
        <List sx={{ width: '100%', mt: 2 }}>
          <ListItem 
            onClick={handleLogout}
            sx={{ textDecoration: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}
          >
            <MenuItemPaper elevation={1}>
              <MenuItemBox>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <ExitToAppIcon sx={{ color: '#2196f3', transform: 'rotate(180deg)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Đăng xuất" 
                  primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                />
              </MenuItemBox>
            </MenuItemPaper>
          </ListItem>
        </List>
      </SidebarContainer>
    </>
  );
};

export default SidebarManager;
