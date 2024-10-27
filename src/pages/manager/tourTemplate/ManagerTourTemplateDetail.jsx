import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Button, Container, Collapse, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTourTemplateById } from '@services/TourTemplateService';

const ManagerTourTemplateDetails = () => {
  const [tourTemplate, setTourTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token) { navigate(`/dang-nhap`); }
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tourTemplate]);

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (!tourTemplate) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
        <title>Chi tiết tour mẫu</title>
      </Helmet>
      <Box sx={{ m: '-60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/quan-ly/tour-mau"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', mt: -1, ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1, ml: -15 }}>
          Chi tiết tour mẫu
        </Typography>
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
          {tourTemplate.provinces.map(province => province.provinceName).join(' - ')}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tourTemplate.tourName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                <img src={tourTemplate.imageUrls[0]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[1]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                  <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                    <img src={tourTemplate.imageUrls[2]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                    <img src={tourTemplate.imageUrls[3]?.url || 'https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg'} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '1.6rem', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Thời lượng:</Typography>
                <Typography sx={{ color: '#05073C' }}>{tourTemplate.duration.durationName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ fontSize: '1.6rem', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Loại tour:</Typography>
                <Typography sx={{ color: '#05073C' }}>{tourTemplate.tourCategoryName}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.description}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.schedule.map((s, index, array) => (
                <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                  {(index === 0 || index === array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '18px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #3572EF',
                        backgroundColor: 'white',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {(index !== 0 && index !== array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '4px',
                        top: '17px',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: '#3572EF',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {index !== array.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 10.5,
                        top: '24px',
                        bottom: -20,
                        width: '2px',
                        backgroundColor: '#3572EF',
                        zIndex: 0,
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                      {`Ngày ${s.dayNumber}: ${s.title}`}
                    </Typography>
                    <IconButton size="small">
                      {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedDay === s.dayNumber} sx={{ ml: 1 }}>
                    <ul>
                      {s.attractions.map((attraction, i) => (
                        <li key={attraction.attractionId}>
                          {attraction.name}
                        </li>
                      ))}
                    </ul>
                    <Typography paragraph sx={{ textAlign: 'justify' }}>
                      {s.description}
                    </Typography>
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.policy}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.note}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Mã tour mẫu:
                  <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.code}</Typography>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.createdDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Người tạo: {tourTemplate.creatorName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Trạng thái:
                  <Typography sx={{ ml: 1, color: tourTemplate.status === 0 ? 'gray' : tourTemplate.status === 1 ? 'primary.main' : tourTemplate.status === 2 ? 'green' : 'red', }}>{tourTemplate.statusName}</Typography>
                </Typography>
              </Box>
              {tourTemplate.status === 1 && (
                <>
                  <Button variant="contained" fullWidth sx={{ mb: 2, height: '45px', backgroundColor: 'green', '&:hover': { backgroundColor: '#2954B5' } }}>Chấp nhận</Button>
                  <Button variant="contained" fullWidth sx={{ mb: 2, height: '45px', backgroundColor: 'red', '&:hover': { backgroundColor: '#2954B5' } }}>Từ chối</Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagerTourTemplateDetails;