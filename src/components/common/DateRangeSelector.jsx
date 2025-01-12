import React from 'react';
import { Box, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';

const DateRangeSelector = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onApply 
}) => {
  const now = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <DatePicker
          label="Từ ngày"
          value={startDate}
          onChange={onStartDateChange}
          format="DD/MM/YYYY"
          maxDate={endDate}
          slotProps={{
            textField: {
              size: "small",
              error: startDate > endDate,
              helperText: startDate > endDate ? "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" : ""
            }
          }}
        />
        <DatePicker
          label="Đến ngày"
          value={endDate}
          onChange={onEndDateChange}
          format="DD/MM/YYYY"
          minDate={startDate}
          maxDate={now}
          slotProps={{
            textField: {
              size: "small",
              error: endDate > now,
              helperText: endDate > now ? "Ngày kết thúc không được lớn hơn hiện tại" : ""
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={onApply}
          disabled={startDate > endDate || endDate > now}
        >
          Áp dụng
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeSelector; 