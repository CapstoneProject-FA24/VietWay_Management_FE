import React from 'react';
import { Box, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DateRangeSelector = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onApply 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <DatePicker
          views={['month', 'year']}
          value={startDate}
          onChange={onStartDateChange}
          maxDate={endDate}
          slotProps={{ textField: { size: 'small' } }}
          label="Từ tháng"
          format="MM/YYYY"
          sx={{ width: 150 }}
        />
        <DatePicker
          views={['month', 'year']}
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate}
          maxDate={dayjs()}
          slotProps={{ textField: { size: 'small' } }}
          label="Đến tháng"
          format="MM/YYYY"
          sx={{ width: 150 }}
        />
        <Button
          variant="contained"
          onClick={onApply}
          sx={{ height: 40 }}
        >
          Áp dụng
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeSelector; 