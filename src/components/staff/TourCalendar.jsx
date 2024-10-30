import React from 'react';
import { Box, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import { getTourStatusInfo } from '@services/StatusService';
import 'react-calendar/dist/Calendar.css';

const TourCalendar = ({ tours, selectedMonth, handleMonthChange }) => {
  const getTourInfo = (date) => {
    const toursOnThisDay = tours.filter(tour =>
      dayjs(tour.startDate).isSame(date, 'day') ||
      (dayjs(tour.startDate).isBefore(date) && dayjs(tour.endDate).isAfter(date)) ||
      dayjs(tour.endDate).isSame(date, 'day')
    );

    return toursOnThisDay.map(tour => ({
      status: tour.status,
      participants: `${tour.currentParticipant}/${tour.maxParticipant}`
    }));
  };

  return (
    <Box sx={{ ml: 1 }}>
      <Calendar
        value={selectedMonth.toDate()}
        onChange={(date) => handleMonthChange(dayjs(date))}
        tileContent={({ date }) => {
          const tourInfo = getTourInfo(dayjs(date));
          if (tourInfo.length === 0) return null;

          return (
            <div style={{ 
              fontSize: '11.8px', 
              lineHeight: '1.1', 
              maxHeight: '100px', 
              overflowY: 'auto' 
            }}>
              {tourInfo.map((info, idx) => (
                <div 
                  key={idx} 
                  style={{
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    height: 'auto',
                    padding: '4px',
                    margin: '1px',
                    borderRadius: '3px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {`${getTourStatusInfo(info.status).text}`} {`(${info.participants})`}
                </div>
              ))}
            </div>
          );
        }}
      />
    </Box>
  );
};

export default TourCalendar;
