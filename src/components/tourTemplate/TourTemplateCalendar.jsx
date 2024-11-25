import React from 'react';
import { Box, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import { getTourStatusInfo } from '@services/StatusService';
import 'react-calendar/dist/Calendar.css';

const TourTemplateCalendar = ({ tourId, tours, selectedMonth, handleMonthChange }) => {
  const getTourInfo = (date) => {
    const toursOnThisDay = tours.filter(tour =>
      dayjs(tour.startDate).isSame(date, 'day')
    );

    return toursOnThisDay.map(tour => ({
      id: tour.id,
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
                    backgroundColor: info.id === tourId ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.1)',
                    height: 'auto',
                    padding: '4px',
                    marginBottom: '4px',
                    marginTop: '4px',
                    borderRadius: '3px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: info.id === tourId ? '2px solid #1976d2' : 'none',
                    color: '#102371'
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

export default TourTemplateCalendar;
