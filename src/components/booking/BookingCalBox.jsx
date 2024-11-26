import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const BookingCalBox = ({ booking, selectedDateObj, calculatePriceDetails, getTotalAmount, onTotalCalculated }) => {
    if (!booking || !selectedDateObj) return null;

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
        return matchingPrice?.price || selectedDateObj.prices.find(p => p.priceId === 'adult')?.price || 0;
    };

    // Group tourists by price category
    const calculateTouristGroups = () => {
        const groups = {};
        
        booking.tourists?.forEach(tourist => {
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

    const touristGroups = calculateTouristGroups();
    const totalAmount = Object.values(touristGroups).reduce((sum, group) => sum + group.total, 0);

    // Call onTotalCalculated whenever the total changes
    React.useEffect(() => {
        onTotalCalculated(totalAmount);
    }, [totalAmount, onTotalCalculated]);

    return (
        <Box 
            sx={{ 
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                minWidth: 250,
                bgcolor: 'background.paper'
            }}
        >
            <Typography variant="subtitle2" gutterBottom>
                Tạm tính cho booking {booking?.bookingCode}
            </Typography>
            <Divider sx={{ my: 1 }} />
            
            {/* Tourist Group Details */}
            {Object.entries(touristGroups).map(([category, data]) => (
                <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        x{data.count} {category}
                    </Typography>
                    <Typography variant="body2">
                        {data.total.toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
            ))}
            
            <Divider sx={{ my: 1 }} />
            
            {/* Total Amount */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle2">Tổng cộng</Typography>
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                    {totalAmount.toLocaleString('vi-VN')}đ
                </Typography>
            </Box>
        </Box>
    );
};

export default BookingCalBox;
