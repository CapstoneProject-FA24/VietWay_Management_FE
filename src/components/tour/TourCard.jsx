import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Button, Stack, Box, Tooltip } from '@mui/material';
import { CalendarToday, AccessTime, Launch, LocationOn, Group, Subtitles, AirlineSeatReclineNormal, Report } from '@mui/icons-material';
import { getTourStatusInfo } from '@services/StatusService';
import { Link,useNavigate } from 'react-router-dom';
import { getCookie } from '@services/AuthenService';
import { TourStatus } from '@hooks/Statuses';

const InfoItem = ({ icon, text }) => (
  <Stack
    direction="row" spacing={1} alignItems="center"
    sx={{ color: 'text.secondary', '& svg': { fontSize: '1.2rem' } }}
  >
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Stack>
);

const TourCard = ({ tour, onViewDetails }) => {
  const isNearCloseDateAndInsufficient = () => {
    const now = new Date();
    const closeDate = new Date(tour.registerCloseDate);
    const oneDayBefore = new Date(closeDate.setDate(closeDate.getDate() - 1));
    return now >= oneDayBefore && tour.currentParticipant < tour.minParticipant && 
    (tour.status == TourStatus.Opened || tour.status == TourStatus.Closed);
  };

  return (
    <Card
      onClick={onViewDetails}
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 2, transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }, cursor: 'pointer'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img" height="200" alt={tour.tourName}
          image={tour.imageUrl}
          sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
        />
        <Chip label={getTourStatusInfo(tour.status).text} size="small" sx={{ mb: 1, color: `${getTourStatusInfo(tour.status).textColor}`, bgcolor: `${getTourStatusInfo(tour.status).backgroundColor}`, position: 'absolute', top: 10, left: 10, fontWeight: 600 }} />
        {isNearCloseDateAndInsufficient() && (
          <Tooltip title={`Tour ${tour.status === 4 ? "đã đóng" : "sắp đóng"} đăng ký nhưng chưa đủ số lượng khách tối thiểu!`} arrow>
            <Report 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                color: 'red',
                borderRadius: '50%',
                fontSize: 30
              }} 
            />
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6" component="h2"
          sx={{
            fontWeight: 600, mb: 1.5, overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}
        >
          {tour.tourName ? tour.tourName : "Không có tên"}
        </Typography>

        <Stack spacing={1}>
          <InfoItem icon={<Subtitles />} text={`Mã tour: ${tour.code}`} />
          <InfoItem icon={<AccessTime />} text={`Thời lượng: ${tour.duration}`} />
          <InfoItem
            icon={<CalendarToday />}
            text={`Thời gian khởi hành: ${new Date(tour.startDate).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            })} ${new Date(tour.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
          />
          <InfoItem
            icon={<LocationOn />} text={(
              <Typography sx={{
                overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', display: '-webkit-box', fontSize: 14
              }}>{`Điểm khởi hành: ${tour.startLocation}`}</Typography>
            )}

          />
          <InfoItem icon={<Group />} text={`Số lượng khách: ${tour.minParticipant} - ${tour.maxParticipant}`} />
          <InfoItem icon={<AirlineSeatReclineNormal />} text={`Số khách hiện tại: ${tour.currentParticipant}`} />
        </Stack>

        <Typography
          variant="h6" color="primary"
          sx={{ mt: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5, mb: -2 }}
        >
          {tour.defaultTouristPrice.toLocaleString()} đ
          <Typography variant="caption" color="text.secondary">/người</Typography>
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: 2 }}>
        <Button variant="outlined" component={Link} to={`/${getCookie("role")}/tour-du-lich/chi-tiet/${tour.id}`} endIcon={<Launch />}
          sx={{
            borderRadius: 5, textTransform: 'none', px: 2,
            fontSize: '0.875rem', backgroundColor: 'transparent', color: 'primary.main',
            borderColor: 'primary.main', border: '1px solid'
          }}
        >
          Chi tiết
        </Button>
      </Box>
    </Card >
  );
};

export default TourCard;