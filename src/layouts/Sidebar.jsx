import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          boxShadow: 1,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          zIndex: 1200, // Ensure sidebar appears above other content
        }}
      >
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            marginBottom: '40px',
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <img src="logo2_color.png" alt="VIETWAY" style={{ height: '55px' }} />
        </Box>

        <Divider />

        <List sx={{ width: '100%' }}>
          <ListItem 
            component={Link} 
            to="/dashboard" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 0,
              marginBottom: 2,
            }}
          >
            <Paper 
              elevation={2} 
              sx={{ 
                width: '100%', 
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <HomeIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                />
              </Box>
            </Paper>
          </ListItem>
        </List>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, pl: 2, fontWeight: 'bold' }}>
          Quản lí chung
        </Typography>
        <List sx={{ width: '100%' }}>
          <ListItem 
            component={Link} 
            to="/cong-ty" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 0,
              marginBottom: 1,
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
                width: '100%', 
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <BarChartIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Công ty" 
                  primaryTypographyProps={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                />
              </Box>
            </Paper>
          </ListItem>
          <ListItem 
            component={Link} 
            to="/quan-li" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 0,
              marginBottom: 1,
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
                width: '100%', 
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <PeopleIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Quản lí" 
                  primaryTypographyProps={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                />
              </Box>
            </Paper>
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />
        <List sx={{ width: '100%', mt: 2 }}>
          <ListItem 
            component={Link} 
            to="/logout" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 0,
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
                width: '100%', 
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <ExitToAppIcon sx={{ color: '#2196f3', transform: 'rotate(180deg)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Đăng xuất" 
                  primaryTypographyProps={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                />
              </Box>
            </Paper>
          </ListItem>
        </List>
      </Box>
    );
};

export default Sidebar;