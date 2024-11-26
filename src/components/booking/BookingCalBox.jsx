import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const BookingCalBox = ({ booking, selectedDateObj, calculatePriceDetails, getTotalAmount }) => {
    if (!booking || !selectedDateObj) return null;
    
    const details = calculatePriceDetails();
    if (!details) return null;

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
            
            {/* Guest Details */}
            {booking.adultQuantity > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        x{booking.adultQuantity} Người lớn
                    </Typography>
                    <Typography variant="body2">
                        {(booking.adultQuantity * selectedDateObj?.prices?.adult?.price).toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
            )}
            
            {booking.childQuantity > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        x{booking.childQuantity} Trẻ em
                    </Typography>
                    <Typography variant="body2">
                        {(booking.childQuantity * selectedDateObj?.prices?.child?.price).toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
            )}
            
            {booking.infantQuantity > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        x{booking.infantQuantity} Em bé
                    </Typography>
                    <Typography variant="body2">
                        {(booking.infantQuantity * selectedDateObj?.prices?.infant?.price).toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            {/* Total Amount */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle2">Tổng cộng</Typography>
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                    {getTotalAmount(details).toLocaleString('vi-VN')}đ
                </Typography>
            </Box>
        </Box>
    );
};

export default BookingCalBox;
