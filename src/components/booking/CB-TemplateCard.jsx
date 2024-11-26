import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Collapse, Select, MenuItem, Tooltip, IconButton, useTheme, Chip, Divider, Tab, Tabs } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { ExpandMore, CalendarToday, Category, LocationOn, AccessTime, LocalActivity, Description, Schedule, Policy, InfoOutlined, Circle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import BookingCalBox from '@components/booking/BookingCalBox';
import ConfirmChange from '@components/booking/ConfirmChange';

// Custom styled expand button
const ExpandButton = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const CBTemplateCard = ({ tour, onSelect, booking }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDateObj, setSelectedDateObj] = useState(null);
    const [isConfirmChangeOpen, setIsConfirmChangeOpen] = useState(false);
    const [availableDates] = useState(tour.availableDates || []);

    // Handle expand click
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handle date selection
    const handleDateChange = (event) => {
        const dateId = event.target.value;
        setSelectedDate(dateId);
        const dateObj = availableDates.find(d => d.id === dateId);
        setSelectedDateObj(dateObj || null);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Tính tổng tiền cho từng loại khách
    const calculatePriceDetails = () => {
        if (!selectedDateObj?.prices || !booking) return null;
        
        const priceDetails = {};
        Object.entries(selectedDateObj.prices).forEach(([key, priceInfo]) => {
            if (priceInfo.price) {
                priceDetails[key] = {
                    ...priceInfo,
                    quantity: booking.numberOfParticipants || 0,
                    total: (booking.numberOfParticipants || 0) * priceInfo.price
                };
            }
        });
        return priceDetails;
    };

    const getTotalAmount = (priceDetails) => {
        if (!priceDetails) return 0;
        return Object.values(priceDetails).reduce((sum, detail) => sum + (detail.total || 0), 0);
    };

    // Update the button click handler
    const handleBookClick = () => {
        if (!selectedDate || !selectedDateObj) return;
        setIsConfirmChangeOpen(true);
    };

    return (
        <>
            <Card sx={{
                width: '100%',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                bgcolor: 'background.paper',
                '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: theme.shadows[4] 
                }
            }}>
                {/* Main Card Content */}
                <Box sx={{ display: 'flex', height: '320px' }}>
                    {/* Left side - Image */}
                    <CardMedia
                        component="img"
                        sx={{
                            width: '35%',
                            objectFit: 'cover'
                        }}
                        image={tour.imageUrl}
                        alt={tour.tourName}
                    />

                    {/* Right side - Content */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
                        <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                            {/* Tour Category & Duration */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Chip
                                    icon={<Category sx={{ fontSize: '1rem' }} />}
                                    label={tour.tourCategory}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime sx={{ fontSize: '1rem' }} />
                                    <Typography variant="body2">
                                        {tour.duration}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Tour Name */}
                            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                                {tour.tourName}
                            </Typography>

                            {/* Code */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalActivity color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {tour.code}
                                </Typography>
                            </Box>

                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocationOn color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {tour.provinces.join(' - ')}
                                </Typography>
                            </Box>

                            {/* Booking Section */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 2,
                                mt: 'auto' 
                            }}>
                                {/* Date Selection Dropdown */}
                                <Select
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    displayEmpty
                                    size="small"
                                    sx={{ minWidth: 250 }}
                                    startAdornment={<CalendarToday sx={{ mr: 1 }} />}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn ngày khởi hành
                                    </MenuItem>
                                    {availableDates?.map((date) => (
                                        <MenuItem 
                                            key={date.id} 
                                            value={date.id}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                py: 1
                                            }}
                                        >
                                            <Box sx={{ 
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 1
                                            }}>
                                                <Typography variant="subtitle2">
                                                    {date.startDate}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '100%' }}>
                                                {date.prices && Object.entries(date.prices).map(([key, priceInfo]) => (
                                                    <Box 
                                                        key={key}
                                                        sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        <Tooltip title={priceInfo.description}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {priceInfo.name}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Typography 
                                                            variant="body2" 
                                                            color="primary.main"
                                                            sx={{ fontWeight: 500 }}
                                                        >
                                                            {priceInfo.price?.toLocaleString('vi-VN')}đ
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>

                                {/* Booking Calculation Box */}
                                {selectedDate && booking && selectedDateObj && (
                                    <BookingCalBox 
                                        booking={booking}
                                        selectedDateObj={selectedDateObj}
                                        calculatePriceDetails={calculatePriceDetails}
                                        getTotalAmount={getTotalAmount}
                                    />
                                )}

                                {/* Book Button */}
                                <Button 
                                    variant="contained"
                                    disabled={!selectedDate}
                                    onClick={handleBookClick}
                                    sx={{ 
                                        textTransform: 'none',
                                        minWidth: 120
                                    }}
                                >
                                    Chọn tour
                                </Button>

                                <ExpandButton
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMore />
                                </ExpandButton>
                            </Box>
                        </CardContent>
                    </Box>
                </Box>

                {/* Modified Expandable Section */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Divider />
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }
                            }}
                        >
                            <Tab icon={<Description sx={{ mr: 1 }} />} label="Tổng quan" iconPosition="start" />
                            <Tab icon={<Schedule sx={{ mr: 1 }} />} label="Lịch trình" iconPosition="start" />
                            <Tab icon={<Policy sx={{ mr: 1 }} />} label="Chính sách" iconPosition="start" />
                            <Tab icon={<InfoOutlined sx={{ mr: 1 }} />} label="Lưu ý" iconPosition="start" />
                        </Tabs>

                        {/* Tổng quan */}
                        {selectedTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Typography paragraph>
                                    {tour.description}
                                </Typography>
                                {tour.highlights && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6" gutterBottom>Điểm nổi bật:</Typography>
                                        {tour.highlights.map((highlight, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                                                <Typography>{highlight}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Lịch trình */}
                        {selectedTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Timeline>
                                    {tour.schedule?.map((day, index) => (
                                        <TimelineItem key={index}>
                                            <TimelineSeparator>
                                                <TimelineDot color="primary" />
                                                {index < tour.schedule.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="h6" component="span">
                                                    Ngày {index + 1}
                                                </Typography>
                                                <Typography>{day.description}</Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </Box>
                        )}

                        {/* Chính sách */}
                        {selectedTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Chính sách tour:</Typography>
                                {tour.policies?.map((policy, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            {policy.title}
                                        </Typography>
                                        <Typography>{policy.content}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Lưu ý */}
                        {selectedTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Lưu ý quan trọng:</Typography>
                                {tour.notes?.map((note, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                                        <Typography>{note}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </Card>

            <ConfirmChange
                open={isConfirmChangeOpen}
                onClose={() => setIsConfirmChangeOpen(false)}
                currentBooking={booking}
                newTour={{
                    name: tour.name,
                    code: tour.code,
                    startDate: selectedDateObj?.startDate,
                    departureLocation: tour.departureLocation,
                    totalPrice: selectedDateObj ? getTotalAmount(calculatePriceDetails()) : 0
                }}
                onConfirm={() => {
                    if (!selectedDate || !selectedDateObj) return;
                    onSelect({ 
                        ...tour, 
                        selectedDate: selectedDateObj.startDate,
                        prices: selectedDateObj.prices 
                    });
                    setIsConfirmChangeOpen(false);
                }}
            />
        </>
    );
};

export default CBTemplateCard;
