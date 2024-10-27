import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@styles/Slider.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { login } from '@services/AuthenService';
import { CircularProgress } from '@mui/material';

export default function Login() {
  const settingLogin = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    className: 'slider'
  };

  const imgs = [
    {
      url: './login1.png',
    },
    {
      url: './login2.png',
    },
    {
      url: './login3.png',
    },
  ];

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (role && token) { navigate(`/${role}/diem-tham-quan`); } //dash-board
  }, [location]);

  const validateEmailOrPhone = (input) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(String(input).toLowerCase()) || phoneRegex.test(input);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email hoặc số điện thoại không được để trống');
      setLoading(false);
      return;
    }

    if (!validateEmailOrPhone(email)) {
      setEmailError('Email hoặc số điện thoại không hợp lệ');
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      if (response.token && response.role) {
        navigate(`/${response.role}/diem-tham-quan`);
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } catch (error) {
      if (error.response?.data?.statusCode === 401 && error.response?.data?.message === 'Email or password is incorrect') {
        setError('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'absolute',
      top: '5%',
      left: '14%'
    }}>
      <Helmet>
        <title>Đăng nhập</title>
      </Helmet>
      <Grid component="main" sx={{ width: '150vh'}}>
        <CssBaseline />
        <Grid item square md={12} sx={{ display: 'flex '}}>
          <Box
            sx={{
              my: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
              textAlign: 'left',
              width: '47%',
              marginRight: 10,
              mt: 6 
            }}
          >
            <img style={{ width: 90, marginBottom: 20 }} src='/logo1_color.png' alt="Logo" />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              Đăng nhập
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1, height: 45 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
              </Button>
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="slick-slider">
            <Slider {...settingLogin}>
              {imgs.map((img, index) => (
                <div key={index}>
                  <img src={img.url} class='slideImg' />
                </div>
              ))}
            </Slider>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
