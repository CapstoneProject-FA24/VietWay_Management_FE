import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Badge } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AttractionsIcon from '@mui/icons-material/Attractions';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { getCookie, removeCookie } from '@services/AuthenService';
import Notification from '@components/Notification';

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

const SidebarStaff = ({ isOpen, toggleSidebar }) => {
  useEffect(() => {
    const role = getCookie('role');
    const token = getCookie('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(5); // Replace with actual notification count

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeCookie('token');
    removeCookie('role');
    navigate('/dang-nhap');
  };

  const handleOpenNotification = () => {
    handleClose();
    setNotificationOpen(true);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <>
      <SidebarContainer isopen={isOpen}>
        <LogoLink to="/">
          <img src="/logo2_color.png" alt="VIETWAY" style={{ height: '55px' }} />
        </LogoLink>
        <ToggleButton onClick={toggleSidebar} isopen={isOpen} sx={{ '&:hover': { backgroundColor: 'lightGrey' } }}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </ToggleButton>
        <Divider />
        <List sx={{ width: '110%', maxHeight: '60vh', overflow: 'auto', ml: -1 }}>
          {[/* eslint-disable */
            { text: 'Điểm Tham Quan', url: '/nhan-vien/diem-tham-quan', icon: <AttractionsIcon /> },
            { text: 'Tour Mẫu', url: '/nhan-vien/tour-mau', icon: <FileCopyIcon /> },
            { text: 'Tour Du Lịch', url: '/nhan-vien/tour-du-lich', icon: <DirectionsBusIcon /> },
            { text: 'Booking', url: '/nhan-vien/booking', icon: <AirplaneTicketIcon /> },
            { text: 'Bài viết', url: '/nhan-vien/bai-viet', icon: <ArticleIcon /> },
          ].map(({ text, url, icon }) => (
            <ListItem
              key={text}
              component={Link}
              to={url}
              sx={{ textDecoration: 'none', color: 'inherit', p: 0 }}
            >
              <MenuItemPaper elevation={0} isSelected={location.pathname === url}>
                <MenuItemBox>
                  <MenuItemPaper2 elevation={1}>
                    {React.cloneElement(icon, { sx: { color: '#2196f3' } })}
                  </MenuItemPaper2>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === url ? 'bold' : 'normal',
                      fontSize: '0.97rem'
                    }}
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
                  {/* <Badge color="error" variant="dot" invisible={!unreadNotifications}> */}
                    <SettingsIcon sx={{ color: '#2196f3' }} />
                  {/* </Badge> */}
                </ListItemIcon>
                <ListItemText
                  primary={getCookie('username')}
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
              navigate('/nhan-vien/thong-tin-tai-khoan');
            }}>Thông tin tài khoản</MenuItem>
            {/* <MenuItem onClick={handleOpenNotification}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span>Thông báo</span>
                {unreadNotifications > 0 && (
                  <Badge
                    badgeContent={unreadNotifications}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': { fontSize: '0.7rem', height: '16px', minWidth: '16px' }
                    }}
                  />
                )}
              </Box>
            </MenuItem> */}
            <MenuItem sx={{ color: 'red' }} onClick={() => {
              handleClose();
              handleLogout();
            }}>Đăng xuất</MenuItem>
          </Menu>
        </List>
      </SidebarContainer>

      <Notification
        open={notificationOpen}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default SidebarStaff;
