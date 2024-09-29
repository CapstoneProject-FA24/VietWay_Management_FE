import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Button, Container, Collapse, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { getTourTemplateById } from '@hooks/MockTourTemplate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams } from 'react-router-dom';

const TourTemplateDetails = () => {
  const [tourTemplate, setTourTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const fetchTourTemplateData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = getTourTemplateById(id);
        setTourTemplate(mockData);
      } catch (error) {
        console.error("Error fetching tour template data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourTemplateData();
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
          to="/nhan-vien/tour-mau"
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
          {tourTemplate.TourTemplateProvinces.map(province => province.ProvinceName).join(' - ')}
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tourTemplate.TourName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', width: '100%', height: '450px', mb: 3, ml: -2.5 }}>
                <Box sx={{ flex: '0 0 60%', mr: 2 }}>
                  <img src={tourTemplate.TourTemplateImages[0].Path} alt={tourTemplate.TourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 43%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: '0 0 50%', mb: 1.2 }}>
                    <img src={tourTemplate.TourTemplateImages[1].Path} alt={tourTemplate.TourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                    <Box sx={{ flex: '0 0 48.2%', mr: 2 }}>
                      <img src={tourTemplate.TourTemplateImages[2].Path} alt={tourTemplate.TourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ flex: '0 0 48.2%' }}>
                      <img src={tourTemplate.TourTemplateImages[3].Path} alt={tourTemplate.TourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, ml: 4, mr: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Thời lượng:</Typography>
                  <Typography sx={{ color: '#05073C' }}>{tourTemplate.Duration}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Khởi hành từ:</Typography>
                  <Typography sx={{ color: '#05073C' }}>{tourTemplate.DeparturePoint}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Loại tour:</Typography>
                  <Typography sx={{ color: '#05073C' }}>{tourTemplate.TourCategory}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.Description}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.TourTemplateSchedule.map((schedule, index, array) => (
                <Box key={schedule.Day} sx={{ pl: 6, position: 'relative' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(schedule.Day)}>
                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                      {`Ngày ${schedule.Day}: ${schedule.Title}`}
                    </Typography>
                    <IconButton size="small">
                      {expandedDay === schedule.Day ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedDay === schedule.Day} sx={{ ml: 1 }}>
                    <ul>
                      {schedule.AttractionSchedules.map((schedule) => (
                        <li key={schedule.AttractionId}>{schedule.AttractionName}</li>
                      ))}
                    </ul>
                    <Typography paragraph sx={{ textAlign: 'justify' }}>
                      {schedule.Description}
                    </Typography>
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.Policy}</Typography>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.Note}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Mã tour mẫu:
                  <Typography sx={{ color: '#05073C', ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.TourCode}</Typography>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.CreatedDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Người tạo: {tourTemplate.CreatedBy}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Trạng thái:
                  <Typography sx={{ color: '#05073C', ml: 1, color: tourTemplate.Status === 'Chờ duyệt' ? 'primary.main' : tourTemplate.Status === 'Đã duyệt' ? 'green' : 'red', }}>{tourTemplate.Status}</Typography>
                </Typography>
              </Box>
              {tourTemplate.Status === 'Đã duyệt' && (
                <Button variant="contained" fullWidth sx={{ mb: 2, height: '45px', backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#2954B5' } }}>Tạo tour từ mẫu</Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TourTemplateDetails;