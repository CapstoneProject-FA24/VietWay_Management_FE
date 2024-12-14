import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Collapse, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TourTemplateInfo = ({ tourTemplate, isLoading }) => {
    const [expanded, setExpanded] = useState(false);
    const [expandedDay, setExpandedDay] = useState(null);

    const handleDayClick = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!tourTemplate) {
        return (
            <Paper elevation={2} sx={{ p: 2, mb: 2, ml: 1 }}>
                <Typography color="error">Không thể tải thông tin tour mẫu</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{ pl: 5, pr: 5, pt: 2, pb: 3, mb: 2, ml: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center', mb: 2 }}>
                Thông tin tour mẫu
            </Typography>

            <Box sx={{ mb: 1 }}>
                <Typography gutterBottom>
                    <strong>Tên Tour: </strong>{tourTemplate.tourName}
                </Typography>
                <Typography gutterBottom>
                    <strong>Mã tour mẫu:</strong> {tourTemplate.code}
                </Typography>
                <Typography gutterBottom>
                    <strong>Loại tour:</strong> {tourTemplate.tourCategoryName}
                </Typography>
                <Typography gutterBottom>
                    <strong>Điểm đến:</strong> {tourTemplate.provinces.map(province => province.provinceName).join(' - ')}
                </Typography>
                <Typography gutterBottom>
                    <strong>Khởi hành:</strong> {tourTemplate.startingProvince?.provinceName}
                </Typography>
                <Typography gutterBottom>
                    <strong>Thời lượng:</strong> {tourTemplate.duration.durationName}
                </Typography>
                <Typography gutterBottom>
                    <strong>Phương tiện:</strong> {tourTemplate.transportation}
                </Typography>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: 700, mb: -2 }}>Tổng quan:</Typography>
                    <Typography paragraph sx={{ textAlign: 'justify' }}>
                        <Box dangerouslySetInnerHTML={{ __html: tourTemplate.description }} sx={{
                            '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                            '& p': { lineHeight: 1.2, mb: 1 }, flexGrow: 1, width: '100%', margin: '0 auto'
                        }} />
                    </Typography>

                    <Typography sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Lịch trình:</Typography>
                    {tourTemplate.schedule.map((s, index, array) => (
                        <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                            {(index === 0 || index === array.length - 1) && (
                                <Box sx={{
                                    position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                                    borderRadius: '50%', border: '2px solid #3572EF', backgroundColor: 'white',
                                    transform: 'translateY(-50%)', zIndex: 1,
                                }} />
                            )}
                            {(index !== 0 && index !== array.length - 1) && (
                                <Box sx={{
                                    position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px',
                                    borderRadius: '50%', backgroundColor: '#3572EF', transform: 'translateY(-50%)', zIndex: 1,
                                }} />
                            )}
                            {index !== array.length - 1 && (
                                <Box sx={{
                                    position: 'absolute', left: 10.5, top: '24px', bottom: -20,
                                    width: '2px', backgroundColor: '#3572EF', zIndex: 0,
                                }} />
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }}
                                onClick={() => handleDayClick(s.dayNumber)}>
                                <Typography sx={{ fontWeight: '700', mr: 1, fontSize: '1.2rem' }}>
                                    {`Ngày ${s.dayNumber}: ${s.title}`}
                                </Typography>
                                <IconButton size="small">
                                    {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            <Collapse in={expandedDay === s.dayNumber} sx={{ ml: 1 }}>
                                <Typography sx={{ mb: -1.5 }}>Các điểm đến:</Typography>
                                <ul>
                                    {s.attractions.map((attraction) => (
                                        <li key={attraction.attractionId}>{attraction.name}</li>
                                    ))}
                                </ul>
                                <Typography>Chi tiết:</Typography>
                                <Box dangerouslySetInnerHTML={{ __html: s.description }} sx={{ '& p': { lineHeight: 1.2, mt: 1, textAlign: 'justify' }}}/>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            </Collapse>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setExpanded(!expanded)} size="small" sx={{ borderRadius: '1px', fontSize: '1rem' }}>
                    {expanded ? (<>Thu gọn<ExpandLessIcon /></>) : (<>Xem thêm chi tiết<ExpandMoreIcon /></>)}
                </IconButton>
            </Box>
        </Paper>
    );
};

export default TourTemplateInfo;
