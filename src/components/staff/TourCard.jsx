import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Button, Stack, Box } from '@mui/material';
import { CalendarToday, AccessTime, Person, LocationOn } from '@mui/icons-material';

const STATUS_CONFIG = {
  "Đang nhận khách": { color: "success", icon: "🟢" },
  "Đã đầy chỗ": { color: "warning", icon: "⚠️" },
  "Hoàn thành": { color: "info", icon: "✅" },
  "Bị Hủy": { color: "error", icon: "❌" },
  "Đang diễn ra": { color: "primary", icon: "🔄" }
};

const InfoItem = ({ icon, text }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', '& svg': { fontSize: '1.2rem' } }}>
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Stack>
);

const TourCard = ({ tour, onViewDetails }) => {
  const statusConfig = STATUS_CONFIG[tour.status] || { color: "default", icon: "❓" };

  return (
    <Card
      onClick={onViewDetails}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        mt: 4,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        cursor: 'pointer'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia 
          component="img" 
          height="200"
          image={tour.images[0].url} 
          alt={tour.tourName}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Chip 
          label={`${statusConfig.icon} ${tour.status}`}
          color={statusConfig.color}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 500
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            mb: 1.5,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {tour.tourName}
        </Typography>

        <Stack spacing={1}>
          <InfoItem 
            icon={<LocationOn />}
            text={`Mã tour: ${tour.tourId}`}
          />
          <InfoItem 
            icon={<CalendarToday />}
            text={`Khởi hành: ${tour.startDate}`}
          />
          <InfoItem 
            icon={<AccessTime />}
            text={`Thời lượng: ${tour.duration}`}
          />
          <InfoItem 
            icon={<Person />}
            text={`Số chỗ còn nhận: ${tour.maxParticipant}`}
          />
        </Stack>

        <Typography 
          variant="h6" 
          color="primary"
          sx={{ 
            mt: 2,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {tour.price.adult.toLocaleString()} đ
          <Typography variant="caption" color="text.secondary">
            /người
          </Typography>
        </Typography>
      </CardContent>

      <CardActions sx={{ 
        p: 2, 
        pt: 0,
        justifyContent: 'center'
      }}>
        {tour.status === "Hoàn thành" && (
          <Button 
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Xem đánh giá
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default TourCard;
