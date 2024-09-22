import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: theme.shadows[1],
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  zIndex: 1200,
}));

const LogoLink = styled(Link)(({ theme }) => ({
  marginBottom: '30px',
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

const MenuItemPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  '&:hover': { backgroundColor: '#f5f5f5' },
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
}));

const MenuItemBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
}));

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoLink to="/">
        <img src="logo2_color.png" alt="VIETWAY" style={{ height: '55px' }} />
      </LogoLink>

      <Divider />

      <List sx={{ width: '100%' }}>
        <ListItem 
          component={Link} 
          to="/dashboard" 
          sx={{ textDecoration: 'none', color: 'inherit', padding: 0, marginBottom: 1, marginTop: 3 }}
        >
          <MenuItemPaper elevation={2}>
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
        {['Công ty', 'Quản lí'].map((text, index) => (
          <ListItem 
            key={text}
            component={Link} 
            to={`/${text.toLowerCase().replace(' ', '-')}`}
            sx={{ textDecoration: 'none', color: 'inherit', padding: 0, marginBottom: 1 }}
          >
            <MenuItemPaper elevation={0}>
              <MenuItemBox>
                <MenuItemPaper2 elevation={1}>
                  {index % 2 === 0 ? <BarChartIcon sx={{ color: '#2196f3' }} /> : <PeopleIcon sx={{ color: '#2196f3' }} />}
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
          component={Link} 
          to="/logout" 
          sx={{ textDecoration: 'none', color: 'inherit', padding: 0 }}
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
  );
};

export default Sidebar;