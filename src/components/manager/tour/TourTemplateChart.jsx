import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TourTemplateStatus } from '@hooks/Statuses';
import { getTourTemplateStatusInfo } from '@services/StatusService';

// Mock data - replace with actual API data later
const mockTemplateData = [
    {
        month: '01/2024',
        [TourTemplateStatus.Draft]: 10,
        [TourTemplateStatus.Pending]: 8,
        [TourTemplateStatus.Approved]: 15,
        [TourTemplateStatus.Rejected]: 3,
    },
    {
        month: '02/2024',
        [TourTemplateStatus.Draft]: 12,
        [TourTemplateStatus.Pending]: 10,
        [TourTemplateStatus.Approved]: 18,
        [TourTemplateStatus.Rejected]: 2,
    },
    {
        month: '03/2024',
        [TourTemplateStatus.Draft]: 15,
        [TourTemplateStatus.Pending]: 12,
        [TourTemplateStatus.Approved]: 20,
        [TourTemplateStatus.Rejected]: 4,
    },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tháng {label}</strong>
                </Typography>
                {payload.map((entry, index) => {
                    const statusInfo = getTourTemplateStatusInfo(parseInt(entry.dataKey));
                    return (
                        <Typography 
                            key={index} 
                            variant="body2" 
                            sx={{ 
                                color: statusInfo.color,
                                backgroundColor: statusInfo.backgroundColor,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                mb: 0.5
                            }}
                        >
                            {statusInfo.text}: {entry.value}
                        </Typography>
                    );
                })}
            </Paper>
        );
    }
    return null;
};

const TourTemplateChart = ({ fixedHeight }) => {
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });
    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    const handleStartDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            startDate: newValue,
            endDate: newValue.isAfter(prev.endDate) ? newValue : prev.endDate
        }));
    };

    const handleEndDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            endDate: newValue
        }));
    };

    const handleApply = () => {
        setAppliedDateRange(dateRange);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: fixedHeight }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                    Thống kê mẫu tour theo trạng thái
                </Typography>
            </Box>

            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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

            <Box sx={{ height: 'calc(100% - 140px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={mockTemplateData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Object.values(TourTemplateStatus).map((status) => {
                            const statusInfo = getTourTemplateStatusInfo(status);
                            return (
                                <Bar
                                    key={status}
                                    dataKey={status.toString()}
                                    name={statusInfo.text}
                                    fill={statusInfo.color}
                                />
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default TourTemplateChart;