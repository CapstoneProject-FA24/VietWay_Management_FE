import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TourStatus } from '@hooks/Statuses';
import { getTourStatusInfo } from '@services/StatusService';
import { Box, Paper, Typography, Button, ButtonGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock data - replace with actual API data later
const mockTemplateData = [
    {
        templateName: 'Hà Nội - Tràng An - Đảo Kong - Bái Đính - Hạ Long - KDL Yên Tử 4 ngày 3 đêm',
        status0: 15, status1: 3, status2: 25, status3: 8, status4: 12, status5: 20, status6: 5,
        total: 88
    },
    {
        templateName: 'Hạ Long Bay 2N1Đ',
        status0: 20, status1: 5, status2: 30, status3: 10, status4: 15, status5: 25, status6: 8,
        total: 113
    },
    {
        templateName: 'Sapa Adventure',
        status0: 18, status1: 4, status2: 28, status3: 7, status4: 14, status5: 22, status6: 6,
        total: 99
    },
    {
        templateName: 'Phú Quốc Resort',
        status0: 25, status1: 6, status2: 35, status3: 12, status4: 18, status5: 28, status6: 9,
        total: 133
    },
    {
        templateName: 'Đà Nẵng - Hội An',
        status0: 22, status1: 5, status2: 32, status3: 9, status4: 16, status5: 26, status6: 7,
        total: 117
    },
    {
        templateName: 'Huế Ancient Tour',
        status0: 12, status1: 8, status2: 20, status3: 10, status4: 10, status5: 15, status6: 5,
        total: 80
    },
    {
        templateName: 'Mekong Delta Experience',
        status0: 18, status1: 4, status2: 28, status3: 5, status4: 10, status5: 25, status6: 7,
        total: 97
    },
    {
        templateName: 'Ninh Bình Nature Tour',
        status0: 10, status1: 6, status2: 15, status3: 5, status4: 8, status5: 18, status6: 4,
        total: 66
    },
    {
        templateName: 'Saigon Highlights',
        status0: 17, status1: 3, status2: 22, status3: 6, status4: 12, status5: 24, status6: 10,
        total: 94
    },
    {
        templateName: 'Cần Thơ Riverside',
        status0: 8, status1: 5, status2: 12, status3: 4, status4: 6, status5: 10, status6: 3,
        total: 48
    },
    {
        templateName: 'Bà Nà Hills Day Trip',
        status0: 20, status1: 7, status2: 30, status3: 9, status4: 14, status5: 20, status6: 5,
        total: 105
    },
    {
        templateName: 'Mui Ne Beach Escape',
        status0: 15, status1: 6, status2: 18, status3: 10, status4: 10, status5: 12, status6: 7,
        total: 78
    },
    {
        templateName: 'Tam Đảo Retreat',
        status0: 14, status1: 5, status2: 19, status3: 7, status4: 13, status5: 21, status6: 8,
        total: 87
    },
    {
        templateName: 'Cát Bà Island Tour',
        status0: 10, status1: 3, status2: 15, status3: 8, status4: 9, status5: 16, status6: 5,
        total: 66
    }
].sort((a, b) => b.total - a.total);


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
                        {' '}({((entry.value / total) * 100).toFixed(1)}%)
                    </Typography>
                ))}
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Tổng số tour: {total}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const TourUsingTemplateChart = () => {
    const [displayCount, setDisplayCount] = useState(5);
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    // Transform TourStatus into readable labels with colors from service
    const statusLabels = {
        [TourStatus.Pending]: getTourStatusInfo(TourStatus.Pending).text,
        [TourStatus.Rejected]: getTourStatusInfo(TourStatus.Rejected).text,
        [TourStatus.Scheduled]: getTourStatusInfo(TourStatus.Scheduled).text,
        [TourStatus.Closed]: getTourStatusInfo(TourStatus.Closed).text,
        [TourStatus.OnGoing]: getTourStatusInfo(TourStatus.OnGoing).text,
        [TourStatus.Completed]: getTourStatusInfo(TourStatus.Completed).text,
        [TourStatus.Cancelled]: getTourStatusInfo(TourStatus.Cancelled).text
    };

    const statusColors = {
        [getTourStatusInfo(TourStatus.Pending).text]: getTourStatusInfo(TourStatus.Pending).color,
        [getTourStatusInfo(TourStatus.Rejected).text]: getTourStatusInfo(TourStatus.Rejected).color,
        [getTourStatusInfo(TourStatus.Scheduled).text]: getTourStatusInfo(TourStatus.Scheduled).color,
        [getTourStatusInfo(TourStatus.Closed).text]: getTourStatusInfo(TourStatus.Closed).color,
        [getTourStatusInfo(TourStatus.OnGoing).text]: getTourStatusInfo(TourStatus.OnGoing).color,
        [getTourStatusInfo(TourStatus.Completed).text]: getTourStatusInfo(TourStatus.Completed).color,
        [getTourStatusInfo(TourStatus.Cancelled).text]: getTourStatusInfo(TourStatus.Cancelled).color
    };

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

    // Filter data based on date range
    // Note: You'll need to modify this when implementing with real data
    const filteredData = mockTemplateData.slice(0, displayCount);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                    Số lượng tour được tạo từ mẫu
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                    <Button
                        onClick={() => setDisplayCount(5)}
                        variant={displayCount === 5 ? 'contained' : 'outlined'}
                    >
                        Top 5
                    </Button>
                    <Button
                        onClick={() => setDisplayCount(10)}
                        variant={displayCount === 10 ? 'contained' : 'outlined'}
                    >
                        Top 10
                    </Button>
                    <Button
                        onClick={() => setDisplayCount(mockTemplateData.length)}
                        variant={displayCount === mockTemplateData.length ? 'contained' : 'outlined'}
                    >
                        Tất cả
                    </Button>
                </ButtonGroup>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            </LocalizationProvider>

            <Box sx={{
                height: displayCount <= 5 ? '250px' :
                    displayCount <= 10 ? '400px' : '700px',
                transition: 'height 0.3s ease-in-out'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="templateName"
                            width={150}
                            tickFormatter={(value) => {
                                const maxLength = 45;
                                if (value.length <= maxLength) return value;
                                return value.slice(0, maxLength) + '...';
                            }}
                            tick={{ 
                                width: 170,
                                fontSize: 12.5,
                                wordWrap: 'break-word'
                            }}
                        />
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
            </Box>
        </Paper>
    );
};

export default TourUsingTemplateChart; 