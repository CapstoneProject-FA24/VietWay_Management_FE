import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookingStatus } from '@hooks/Statuses';
import { getBookingStatusInfo } from '@services/StatusService';
import { Box, Paper, Typography, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const mockBookingData = [
    { period: "01/2024", status0: 5, status1: 12, status2: 45, status3: 18, status4: 25, status5: 10, status6: 3 },
    { period: "02/2024", status0: 30, status1: 50, status2: 35, status3: 10, status4: 8, status5: 5, status6: 2 },
    { period: "03/2024", status0: 8, status1: 22, status2: 55, status3: 15, status4: 12, status5: 4, status6: 1 },
    { period: "04/2024", status0: 40, status1: 18, status2: 40, status3: 8, status4: 3, status5: 6, status6: 7 },
    { period: "05/2024", status0: 12, status1: 30, status2: 50, status3: 20, status4: 15, status5: 8, status6: 3 },
    { period: "06/2024", status0: 60, status1: 10, status2: 25, status3: 12, status4: 5, status5: 2, status6: 3 },
    { period: "07/2024", status0: 15, status1: 45, status2: 35, status3: 25, status4: 18, status5: 9, status6: 4 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        
        return (
            <Paper sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{label}</strong>
                </Typography>
                {payload.map((entry, index) => (
                    <Typography 
                        key={index} 
                        variant="body2" 
                        sx={{ color: entry.color }}
                    >
                        {entry.name}: {entry.value}
                    </Typography>
                ))}
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Tổng: {total}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const BookingChart = () => {
    const [dateRange, setDateRange] = React.useState({
        startDate: dayjs('2024-01-01'),
        endDate: dayjs('2024-07-01')
    });

    // Add new state for applied date range
    const [appliedDateRange, setAppliedDateRange] = React.useState({
        startDate: dayjs('2024-01-01'),
        endDate: dayjs('2024-07-01')
    });

    // Transform BookingStatus into readable labels with colors from service
    const statusLabels = {
        [BookingStatus.Pending]: getBookingStatusInfo(BookingStatus.Pending).text,
        [BookingStatus.Confirmed]: getBookingStatusInfo(BookingStatus.Confirmed).text,
        [BookingStatus.Completed]: getBookingStatusInfo(BookingStatus.Completed).text,
        [BookingStatus.Expired]: getBookingStatusInfo(BookingStatus.Expired).text,
        [BookingStatus.Cancelled]: getBookingStatusInfo(BookingStatus.Cancelled).text,
        [BookingStatus.PendingRefund]: getBookingStatusInfo(BookingStatus.PendingRefund).text,
        [BookingStatus.Refunded]: getBookingStatusInfo(BookingStatus.Refunded).text
    };

    // Define colors from service
    const statusColors = {
        [getBookingStatusInfo(BookingStatus.Pending).text]: getBookingStatusInfo(BookingStatus.Pending).color,
        [getBookingStatusInfo(BookingStatus.Confirmed).text]: getBookingStatusInfo(BookingStatus.Confirmed).color,
        [getBookingStatusInfo(BookingStatus.Completed).text]: getBookingStatusInfo(BookingStatus.Completed).color,
        [getBookingStatusInfo(BookingStatus.Expired).text]: getBookingStatusInfo(BookingStatus.Expired).color,
        [getBookingStatusInfo(BookingStatus.Cancelled).text]: getBookingStatusInfo(BookingStatus.Cancelled).color,
        [getBookingStatusInfo(BookingStatus.PendingRefund).text]: getBookingStatusInfo(BookingStatus.PendingRefund).color,
        [getBookingStatusInfo(BookingStatus.Refunded).text]: getBookingStatusInfo(BookingStatus.Refunded).color
    };

    // Update filteredData to use appliedDateRange instead of dateRange
    const filteredData = mockBookingData.filter(item => {
        const itemDate = dayjs(item.period, 'MM/YYYY');
        return itemDate.isAfter(appliedDateRange.startDate, 'month') || itemDate.isSame(appliedDateRange.startDate, 'month') &&
            (itemDate.isBefore(appliedDateRange.endDate, 'month') || itemDate.isSame(appliedDateRange.endDate, 'month'));
    });

    const handleStartDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            startDate: newValue,
            // If new start date is after current end date, set end date equal to start date
            endDate: newValue.isAfter(prev.endDate) ? newValue : prev.endDate
        }));
    };

    const handleEndDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            // If new end date is before current start date, update start date
            startDate: newValue.isBefore(prev.startDate) ? newValue.subtract(1, 'month') : prev.startDate,
            endDate: newValue
        }));
    };

    // Add handler for Apply button
    const handleApply = () => {
        setAppliedDateRange(dateRange);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 550 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
                Thống kê số lượng booking
            </Typography>
            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 2 }}>
                    <DatePicker
                        views={['month', 'year']}
                        value={dateRange.startDate}
                        onChange={handleStartDateChange}
                        maxDate={dateRange.endDate}
                        slotProps={{ textField: { size: 'small' } }}
                        label="Từ tháng"
                        format="MM/YYYY"
                        sx={{ width: 150 }}
                    />
                    <DatePicker
                        views={['month', 'year']}
                        value={dateRange.endDate}
                        onChange={handleEndDateChange}
                        minDate={dateRange.startDate}
                        maxDate={dayjs()}
                        slotProps={{ textField: { size: 'small' } }}
                        label="Đến tháng"
                        format="MM/YYYY"
                        sx={{ width: 150 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleApply}
                        sx={{ height: 40 }}
                    >
                        Áp dụng
                    </Button>
                </Box>
            </LocalizationProvider>*/}
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={filteredData}
                    margin={{ top: 20, right: 5, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {Object.entries(statusLabels).map(([status, label]) => (
                        <Bar
                            key={status}
                            dataKey={`status${status}`}
                            name={label}
                            fill={statusColors[label]}
                            stackId="status"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default BookingChart;
