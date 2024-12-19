import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Collapse, Select, MenuItem, Tooltip, IconButton, useTheme, Chip, Divider, Tab, Tabs, Grid } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { ExpandMore, DirectionsBus, Category, LocationOn, AccessTime, LocalActivity, Description, Schedule, Policy, InfoOutlined, Circle } from '@mui/icons-material';
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
    marginRight: 'auto', // Add right margin auto
    display: 'flex',     // Add flex display
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const CBTemplateCard = ({ tour, onSelect, booking, onRefresh }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDateObj, setSelectedDateObj] = useState(null);
    const [isConfirmChangeOpen, setIsConfirmChangeOpen] = useState(false);
    const [availableDates] = useState(tour.tours?.map(t => ({
        id: t.tourId,
        startDate: t.startDate,
        startLocation: t.startLocation,
        tourPolicies: t.tourPolicies,
        depositPercent: t.depositPercent,
        paymentDeadline: t.paymentDeadline,
        prices: [
            {
                priceId: 'adult',
                name: 'Người lớn',
                price: t.defaultTouristPrice,
                description: 'Giá người lớn',
            },
            ...(t.tourPrices?.map(price => ({
                priceId: price.priceId,
                name: price.name,
                price: price.price,
                description: `Độ tuổi: ${price.ageFrom || 0} - ${price.ageTo || 'không giới hạn'}`,
                ageFrom: price.ageFrom,
                ageTo: price.ageTo
            })) || [])
        ]
    })) || []);

    const [calculatedTotal, setCalculatedTotal] = useState(0);

    const calculatePriceForTourist = (tourist, prices) => {
        const birthDate = new Date(tourist.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        // Find matching price category based on age
        const matchingPrice = prices.find(price => {
            const meetsMinAge = price.ageFrom === null || age >= price.ageFrom;
            const meetsMaxAge = price.ageTo === null || age <= price.ageTo;
            return meetsMinAge && meetsMaxAge;
        });

        // If no matching price found, use default adult price
        return matchingPrice?.price || selectedDateObj?.prices.find(p => p.priceId === 'adult')?.price || 0;
    };

    const calculateTouristGroups = () => {
        if (!booking?.tourists || !selectedDateObj?.prices) return {};

        const groups = {};

        booking.tourists.forEach(tourist => {
            const price = calculatePriceForTourist(tourist, selectedDateObj.prices);
            const matchingPriceCategory = selectedDateObj.prices.find(p => p.price === price);

            const categoryName = matchingPriceCategory?.name || 'Người lớn';

            if (!groups[categoryName]) {
                groups[categoryName] = {
                    count: 0,
                    pricePerPerson: price,
                    total: 0
                };
            }

            groups[categoryName].count++;
            groups[categoryName].total += price;
        });

        return groups;
    };

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

    // Calculate total price for each type of participant
    const calculatePriceDetails = () => {
        if (!selectedDateObj?.prices || !booking) return null;

        const priceDetails = {};
        selectedDateObj.prices.forEach(priceInfo => {
            if (priceInfo.price) {
                priceDetails[priceInfo.name] = {
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
                <Box sx={{ display: 'flex', height: '340px' }}>
                    {/* Left side - Image */}
                    <CardMedia
                        component="img"
                        sx={{
                            width: '33%',
                            objectFit: 'cover'
                        }}
                        image={tour.imageUrl}
                        alt={tour.tourName}
                    />

                    {/* Right side - Content */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '67%' }}>
                        <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                            {/* Tour Category & Duration */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Chip
                                    icon={<Category sx={{ fontSize: '1rem' }} />}
                                    label={tour.tourCategory} size="small" color="primary" variant="outlined"
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime sx={{ fontSize: '1rem' }} />
                                    <Typography variant="body2"> {tour.duration} </Typography>
                                </Box>
                            </Box>

                            {/* Tour Name */}
                            <Typography variant="h5" component="div" sx={{ mb: 1, mt: 2, fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {tour.tourName}
                            </Typography>
                            {/* Code */}
                            <Grid container spacing={2}>
                                <Grid item xs={6.4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={5.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocalActivity color="action" />
                                            <Typography variant="body2" color="text.secondary">Mã: {tour.code} </Typography>
                                        </Grid>
                                        <Grid item xs={6.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DirectionsBus color="action" />
                                            <Typography variant="body2" color="text.secondary">Phương tiện: {tour.transportation} </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOn color="action" />
                                            <Typography variant="body2" color="text.secondary">Tour đi: {tour.provinces.join(' - ')} </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 'auto' }}>
                                                {/* Date Selection Dropdown */}
                                                <Select value={selectedDate} onChange={handleDateChange} displayEmpty size="small" sx={{ width: '28rem' }}>
                                                    <MenuItem value="" disabled>
                                                        Chọn ngày khởi hành
                                                    </MenuItem>
                                                    {availableDates?.map((date) => (
                                                        <MenuItem
                                                            key={date.id} value={date.id}
                                                            sx={{
                                                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1
                                                            }}
                                                        >
                                                            <Box sx={{
                                                                width: '100%', display: 'flex', flexDirection: 'column',
                                                                justifyContent: 'space-between', mb: 1
                                                            }}>
                                                                <Typography variant="subtitle2">
                                                                    Khởi hành lúc: {new Date(date.startDate).toLocaleDateString('vi-VN')} - {new Date(date.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                                    Khởi hành từ: {date.startLocation.length > 47
                                                                        ? `${date.startLocation.substring(0, 47)}...`
                                                                        : date.startLocation}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ width: '100%' }}>
                                                                {date.prices?.map((priceInfo) => (
                                                                    <Box
                                                                        key={priceInfo.priceId}
                                                                        sx={{
                                                                            display: 'flex', justifyContent: 'space-between',
                                                                            alignItems: 'center', mb: 0.5
                                                                        }}
                                                                    >
                                                                        <Tooltip title={priceInfo.description || ''}>
                                                                            <Typography variant="body2" color="text.secondary"> {priceInfo.name} </Typography>
                                                                        </Tooltip>
                                                                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }} >
                                                                            {priceInfo.price?.toLocaleString('vi-VN')}đ
                                                                        </Typography>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3.8}>
                                    {selectedDate && booking && selectedDateObj && (
                                        <Box sx={{ display: 'flex', height: '70%' }}>
                                            <BookingCalBox
                                                booking={booking}
                                                selectedDateObj={selectedDateObj}
                                                calculatePriceDetails={calculatePriceDetails}
                                                getTotalAmount={getTotalAmount}
                                                onTotalCalculated={setCalculatedTotal}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={1.8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'column' }}>
                                    <Button variant="contained" disabled={!selectedDate} onClick={handleBookClick} sx={{ textTransform: 'none' }}>
                                        Chọn tour
                                    </Button>
                                    <ExpandButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more" sx={{ fontSize: '0.9rem' }}>
                                        <ExpandMore sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                        {expanded ? 'Thu gọn' : 'Xem thêm'}
                                    </ExpandButton>
                                </Grid>
                            </Grid>
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
                                <Box dangerouslySetInnerHTML={{ __html: tour.description }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
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
                                    {tour.schedules?.map((day, index) => (
                                        <TimelineItem key={index}>
                                            <TimelineSeparator sx={{ ml: '-100%' }}>
                                                <TimelineDot color="primary" />
                                                {index < tour.schedules.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="h6" component="span">
                                                    Ngày {day.dayNumber} - {day.title}
                                                </Typography>
                                                <Typography>Các điểm đến:</Typography>
                                                <ul>
                                                    {day.attractions.map((attraction) => (
                                                        <li key={attraction.attractionId}>{attraction.name}</li>
                                                    ))}
                                                </ul>
                                                <Typography sx={{ mt: 1.5 }}>Chi tiết:</Typography>
                                                <Box dangerouslySetInnerHTML={{ __html: day.description }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </Box>
                        )}

                        {/* Chính sách */}
                        {selectedTab === 2 && (
                            <Box sx={{ p: 3 }}>
                                {selectedDateObj ? (
                                    <>
                                        <Typography variant="h6" gutterBottom>Chính sách thanh toán:</Typography>
                                        {selectedDateObj?.depositPercent === 100 ? (
                                            <Typography variant="subtitle1">
                                                - Thanh toán hết toàn bộ khi đăng ký
                                            </Typography>
                                        ) : (
                                            <>
                                                <Typography variant="subtitle1">
                                                    - Thanh toán {selectedDateObj?.depositPercent}% khi đăng ký
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    - Thanh toán hết toàn bộ trước {new Date(selectedDateObj?.paymentDeadline).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </>
                                        )}
                                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Chính sách hủy tour:</Typography>
                                        {(selectedDateObj?.tourPolicies && selectedDateObj?.tourPolicies?.length > 0) ? (
                                            <>
                                                {selectedDateObj?.tourPolicies?.map((policy, index) => (
                                                    <Box key={index} sx={{ display: 'flex' }}>
                                                        <Typography variant="subtitle1">
                                                            - Hủy trước ngày {new Date(policy.cancelBefore).toLocaleDateString('vi-VN')} - Chi phí hủy tour {policy.refundPercent}% giá trị booking
                                                        </Typography>
                                                    </Box>
                                                ))}
                                                <Typography variant="subtitle1">
                                                    - Hủy từ ngày {new Date(selectedDateObj?.tourPolicies?.[selectedDateObj.tourPolicies.length - 1]?.cancelBefore).toLocaleDateString('vi-VN')} - Chi phí hủy tour 100% giá trị booking
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Typography>- Tour này không hỗ trợ hoàn tiền khi khách hàng hủy tour.</Typography>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Typography variant="subtitle1">Vui lòng chọn ngày khởi hành để xem chính sách</Typography>
                                )}
                            </Box>
                        )}

                        {/* Lưu ý */}
                        {selectedTab === 3 && (
                            <Box sx={{ p: 3 }}>
                                <Box dangerouslySetInnerHTML={{ __html: tour.note }} sx={{ '& p': { lineHeight: 1.2, mt: 0, textAlign: 'justify' } }} />
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </Card>

            <ConfirmChange
                open={isConfirmChangeOpen}
                onClose={() => setIsConfirmChangeOpen(false)}
                currentBooking={booking}
                onRefresh={onRefresh}
                newTour={{
                    tourId: selectedDate,
                    duration: tour.duration,
                    tourName: tour.tourName,
                    provinces: tour.provinces,
                    startDate: selectedDateObj?.startDate,
                    startLocation: selectedDateObj?.startLocation,
                    totalAmount: calculatedTotal
                }}
                onConfirm={() => {
                    if (!selectedDate || !selectedDateObj) return;
                    onSelect({
                        ...tour,
                        selectedDate: selectedDateObj.startDate,
                        startLocation: selectedDateObj.startLocation,
                        prices: selectedDateObj.prices
                    });
                    setIsConfirmChangeOpen(false);
                }}
            />
        </>
    );
};

export default CBTemplateCard;
