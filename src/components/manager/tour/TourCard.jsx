import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Button, Stack, Box } from '@mui/material';
import { CalendarToday, AccessTime, Person, LocationOn } from '@mui/icons-material';
import { getTourStatusInfo } from '@services/StatusService';
import { TourStatus } from "@hooks/Statuses";

const InfoItem = ({ icon, text }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      color: 'text.secondary',
      '& svg': { fontSize: '1.2rem' }
    }}
  >
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Stack>
);

const TourCard = ({ tour, onViewDetails }) => {

  return (
    <Card
      onClick={onViewDetails}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
          image={'https://r2.nucuoimekong.com/wp-content/uploads/ban-cat-sapa-a.jpg'/* tour.images[0].url */}
          alt={tour.tourName}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Chip
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  backgroundColor: getTourStatusInfo(tour.status).color,
                }}
              />
              <Typography sx={{ color: getTourStatusInfo(tour.status).textColor, fontWeight: 600, fontSize: 13 }}>
                {getTourStatusInfo(tour.status).text}
              </Typography>
            </Box>
          }
          size="small"
          sx={{
            position: 'absolute',
            top: 12, pt: 1.7, pb: 1.7, pr: 0.3,
            left: 12,
            backgroundColor: getTourStatusInfo(tour.status).backgroundColor,
            fontWeight: 600,
            '& .MuiChip-label': {
              px: 1
            }
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
          {tour.tourName ? tour.tourName : "Không có tên"}
        </Typography>

        <Stack spacing={1}>
          <InfoItem
            icon={<LocationOn />}
            text={`Mã tour: ${tour.tourId}`}
          />
          <InfoItem
            icon={<AccessTime />}
            text={`Thời lượng: ${tour.duration}`}
          />
          <InfoItem
            icon={<CalendarToday />}
            text={`Thời gian khởi hành: ${new Date(tour.startDate).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })} ${new Date(tour.startDate).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}`}
          />
          <InfoItem
            icon={<CalendarToday />}
            text={`Điểm khởi hành: ${tour.startLocation}`}
          />
          <InfoItem
            icon={<Person />}
            text={`Nhận tối đa: ${tour.maxParticipant}`}
          />
          <InfoItem
            icon={<Person />}
            text={`Nhận tối thiểu: ${tour.maxParticipant}`}
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
          {tour.price.toLocaleString()} đ
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
        {tour.status === TourStatus.Completed && (
          <Button
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Xem đánh giá
          </Button>
        )}
      </CardActions>
    </Card >
  );
};

export default TourCard;
