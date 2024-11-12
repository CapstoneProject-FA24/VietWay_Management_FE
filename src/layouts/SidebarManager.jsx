import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, IconButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapIcon from '@mui/icons-material/Map';
import TourIcon from '@mui/icons-material/Tour';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AttractionsIcon from '@mui/icons-material/Attractions';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import CategoryIcon from '@mui/icons-material/Category';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { getCookie, removeCookie } from '@services/AuthenService';

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
  marginBottom: '10px',
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
  width: '37px',
  height: '37px',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '12px',
}));

const MenuItemBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 10px',
}));

const SidebarManager = ({ isOpen, toggleSidebar }) => {
  useEffect(() => {
    const role = getCookie('role');
    const token = getCookie('token');
    if (!role || !token || role !== 'quan-ly') { navigate(`/dang-nhap`); }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    removeCookie('token');
    removeCookie('role');
    
    navigate('/dang-nhap');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} isopen={isOpen} sx={{ '&:hover': { backgroundColor: 'lightGrey' }}}>
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
            to="/quan-ly" 
            sx={{ textDecoration: 'none', color: 'inherit', padding: 0, marginTop: 1 }}
          >
            <MenuItemPaper elevation={2} isSelected={location.pathname === '/quan-ly'}>
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

        <List sx={{ width: '110%', maxHeight: '60vh', overflow: 'auto', ml: -1 }}>
          {[
            { text: 'Tỉnh thành', url: '/quan-ly/tinh-thanh', icon: <MapIcon /> },
            { text: 'Điểm tham quan', url: '/quan-ly/diem-tham-quan', icon: <AttractionsIcon /> },
            { text: 'Tour mẫu', url: '/quan-ly/tour-mau', icon: <FileCopyIcon /> },
            { text: 'Tour du lịch', url: '/quan-ly/tour-du-lich', icon: <TourIcon /> },
            { text: 'Booking', url: '/quan-ly/booking', icon: <AirplaneTicketIcon /> },
            { text: 'Bài viết', url: '/quan-ly/bai-viet', icon: <ArticleIcon /> },
            { text: 'Sự kiện', url: '/quan-ly/su-kien', icon: <EventIcon /> },
            { text: 'Nhân viên', url: '/quan-ly/nhan-vien', icon: <PeopleIcon /> },
            { text: 'Khách hàng', url: '/quan-ly/khach-hang', icon: <PersonIcon /> },
            { text: 'Danh mục', url: '/quan-ly/danh-muc', icon: <CategoryIcon /> },
          ].map(({ text, url, icon }) => (
            <ListItem 
              key={text} component={Link}  to={url}
              sx={{ textDecoration: 'none', color: 'inherit', p: 0 }}
            >
              <MenuItemPaper elevation={0} isSelected={location.pathname === url}>
                <MenuItemBox>
                  <MenuItemPaper2 elevation={1}>
                    {React.cloneElement(icon, { sx: { color: '#2196f3' } })}
                  </MenuItemPaper2>
                  <ListItemText 
                    primary={text} 
                    primaryTypographyProps={{ fontWeight: location.pathname === url ? 'bold' : 'normal', fontSize: '0.97rem' }}
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
            onClick={handleClick}
            sx={{ textDecoration: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}
          >
            <MenuItemPaper elevation={1}>
              <MenuItemBox>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <SettingsIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Tài khoản" 
                  primaryTypographyProps={{ fontSize: '0.97rem' }}
                />
              </MenuItemBox>
            </MenuItemPaper>
          </ListItem>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => {
              handleClose();
              navigate('/quan-ly/thong-tin-tai-khoan');
            }}>Thông tin tài khoản</MenuItem>
            <MenuItem sx={{ color: 'red' }} onClick={() => {
              handleClose();
              handleLogout();
            }}>Đăng xuất</MenuItem>
          </Menu>
        </List>
      </SidebarContainer>
    </>
  );
};

export default SidebarManager;
