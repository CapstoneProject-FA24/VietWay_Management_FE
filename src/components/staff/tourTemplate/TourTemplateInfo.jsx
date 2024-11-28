import React from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse, Button } from '@mui/material';
import { TourTemplateStatus } from '@hooks/Statuses';
import ReviewListTour from '@components/review/ReviewListTour';
import TourTable from '@components/tourTemplate/TourTable';

const TourTemplateInfo = ({ tours, tourTemplate, expandedDay, handleDayClick }) => {
  return (
    <Box sx={{ p: 3, flexGrow: 1, mt: 5, width: '100%' }}>
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
              <img src={tourTemplate.imageUrls[0]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                <img src={tourTemplate.imageUrls[1]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[2]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[3]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
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

          {/* Overview section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
            <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.description}</Typography>
          </Box>

          {/* Schedule section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
            {tourTemplate.schedule.map((s, index, array) => (
              <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                {/* Timeline dots and lines */}
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
                    {s.attractions.map((attraction) => (
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

          {/* Policy section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
            <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.policy}</Typography>
          </Box>

          {/* Note section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
            <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{tourTemplate.note}</Typography>
          </Box>
        </Grid>

        {/* Sidebar */}
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
                <Typography sx={{ ml: 1, color: tourTemplate.status === 0 ? 'gray' : tourTemplate.status === 1 ? 'primary.main' : tourTemplate.status === 2 ? 'green' : 'red', }}>{tourTemplate.statusName}</Typography>
              </Typography>
            </Box>
            {tourTemplate.status === 2 && (
              <Button variant="contained" fullWidth sx={{ mb: 2, height: '45px', backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#2954B5' } }}>Tạo tour từ mẫu</Button>
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