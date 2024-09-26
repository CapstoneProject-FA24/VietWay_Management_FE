import React from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: '#CAECFF',
  '&:hover': {
    backgroundColor: alpha('#CAECFF', 0.9),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '100',
  },
  [theme.breakpoints.up('md')]: {
    width: '100%',
  },
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  marginTop: '10px',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  marginTop: '10px',
  marginLeft: '5px',
}));

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1, width: '100%' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/trang-chu" sx={{ color: 'text.primary' }}>
          <img src="/logo2_color.png" alt="Logo" style={{ height: '55px', marginTop: '15px' }} />
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Search sx={{ flexGrow: 1 }}>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton sx={{ p: '10px', marginTop: '10px', marginLeft: '-15px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', marginLeft: 3, marginRight: 3 }}>
          <StyledButton color="inherit" component={Link} to="/trang-chu" sx={{ color: 'text.primary', textTransform: 'none' }}>Trang chủ</StyledButton>
          <StyledButton color="inherit" component={Link} to="/diem-tham-quan" sx={{ color: 'text.primary', textTransform: 'none' }}>Điểm tham quan</StyledButton>
          <StyledButton color="inherit" component={Link} to="/tour-du-lich" sx={{ color: 'text.primary', textTransform: 'none' }}>Tour du lịch</StyledButton>
          <StyledButton color="inherit" component={Link} to="/tour-du-lich" sx={{ color: 'text.primary', textTransform: 'none' }}>Liên hệ</StyledButton>
        
        </Box>
        
        <Box sx={{ display: 'flex', marginLeft: 1 }}>
          <StyledButton color="inherit" component={Link} to="/dang-ky" sx={{ color: 'text.primary', textTransform: 'none' }}>Đăng ký</StyledButton>
          <StyledButton color="inherit" component={Link} to="/dang-nhap" sx={{ color: 'white', textTransform: 'none', backgroundColor: '#3572EF', borderRadius: '100px', padding: '9px 14px', marginLeft: '10px', '&:hover': { backgroundColor: '#CAECFF' } }}>Đăng nhập</StyledButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
