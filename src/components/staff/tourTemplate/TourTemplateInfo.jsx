import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Paper, IconButton, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse, Button } from '@mui/material';
import { TourTemplateStatus } from '@hooks/Statuses';
import ReviewListTour from '@components/review/ReviewListTour';
import TourTable from '@components/tourTemplate/TourTable';
import { getTourTemplateStatusInfo } from '@services/StatusService';

const TourTemplateInfo = ({ tours, tourTemplate, expandedDay, handleDayClick }) => {
  return (
    <Box sx={{ p: 3, flexGrow: 1, mt: 5, width: '100%' }}>
      <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
        Tour đi: <strong>{tourTemplate.provinces.map(province => province.provinceName).join(' - ')}</strong>
      </Typography>
      <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
        Khởi hành từ: <strong>{tourTemplate.startingProvince?.provinceName}</strong>
      </Typography>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
        {tourTemplate.tourName}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
            <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
              <img src={tourTemplate.imageUrls[0]?.imageUrl || "/no-image.jpg"} alt={tourTemplate.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                <img src={tourTemplate.imageUrls[1]?.imageUrl || "/no-image.jpg"} alt={tourTemplate.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[2]?.imageUrl || "/no-image.jpg"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[3]?.imageUrl || "/no-image.jpg"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Thời lượng:</Typography>
              <Typography sx={{ color: '#05073C' }}>{tourTemplate.duration.durationName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Loại tour:</Typography>
              <Typography sx={{ color: '#05073C' }}>{tourTemplate.tourCategoryName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography sx={{ color: '#05073C', fontWeight: 600, mr: 1, ml: 1 }}>Phương tiện:</Typography>
              <Typography sx={{ color: '#05073C' }}>{tourTemplate.transportation}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
              Tổng quan
            </Typography>
            <Box sx={{ textAlign: 'justify', color: '#05073C' }}>
              <Box dangerouslySetInnerHTML={{ __html: tourTemplate.description }} sx={{
                '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                '& p': { lineHeight: 1.2, mb: 1 }, flexGrow: 1, width: '100%', margin: '0 auto'
              }} />
            </Box>
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
                  <Typography sx={{ mb: -1.5 }}>Các điểm đến:</Typography>
                  <ul>
                    {s.attractions.map((attraction) => (
                      <li key={attraction.attractionId}>
                        {attraction.name}
                      </li>
                    ))}
                  </ul>
                  <Typography>Chi tiết:</Typography>
                  <Box dangerouslySetInnerHTML={{ __html: s.description }} sx={{ '& p': { lineHeight: 1.2, mt: 1, textAlign: 'justify' }}}/>
                </Collapse>
              </Box>
            ))}
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
              Lưu ý
            </Typography>
            <Box dangerouslySetInnerHTML={{ __html: tourTemplate.note }}/>
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
              <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
              <Typography sx={{ color: '#05073C' }}>
                Giá từ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tourTemplate.minPrice)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
              <Typography sx={{ color: '#05073C' }}>
                Đến: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tourTemplate.maxPrice)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
              <Typography sx={{ color: '#05073C', display: 'flex' }}>
                Trạng thái:
                <Chip label={getTourTemplateStatusInfo(tourTemplate.status).text} size="medium" sx={{ fontSize: '1rem', ml: 1, color: `${getTourTemplateStatusInfo(tourTemplate.status).color}`, bgcolor: `${getTourTemplateStatusInfo(tourTemplate.status).backgroundColor}` }} />
              </Typography>
            </Box>
            {tourTemplate.status === 2 && (
              <Button component={Link} to={`/nhan-vien/tour-du-lich/tour-mau-duoc-duyet/tao-tour/${tourTemplate.tourTemplateId}`} variant="contained" fullWidth sx={{ mb: 2, height: '45px', backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#2954B5' } }}>Tạo tour từ mẫu</Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ mb: 5, maxWidth: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{
              textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3
            }}>
              Danh sách
            </Typography>
            <TourTable tours={tours} />
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          {tourTemplate.status === TourTemplateStatus.Approved && (
            <>
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                  Đánh giá từ khách hàng
                </Typography>
                <ReviewListTour tourTemplateId={tourTemplate.tourTemplateId} />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TourTemplateInfo; 