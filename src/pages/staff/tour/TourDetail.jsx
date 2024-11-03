import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Chip, TextField } from '@mui/material';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, fetchTourById, calculateEndDate } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TourCalendar from '@components/staff/tour/TourCalendar';
import TourTemplateInfo from '@components/staff/tour/TourTemplateInfo';
import { getTourStatusInfo } from '@services/StatusService';
import { TourStatus } from '@hooks/Statuses';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTourData, setEditTourData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedTour = await fetchTourById(id);
        setTour(fetchedTour);
        const fetchedTourTemplate = await fetchTourTemplateById(fetchedTour.tourTemplateId);
        setTourTemplate(fetchedTourTemplate);
        const fetchedTours = await fetchToursByTemplateId(fetchedTour.tourTemplateId);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (tour && !editTourData) {
      setEditTourData({
        startAddress: tour.startLocation,
        startDate: dayjs(tour.startDate),
        startTime: dayjs(tour.startTime),
        maxParticipants: tour.maxParticipant,
        minParticipants: tour.minParticipant,
        adultPrice: tour.price,
        childPrice: tour.childPrice,
        infantPrice: tour.infantPrice,
        registerOpenDate: dayjs(tour.registerOpenDate),
        registerCloseDate: dayjs(tour.registerCloseDate)
      });
    }
  }, [tour]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    if (newMonth !== 'all') {
      const today = dayjs();
      let startDate;
      if (newMonth.isSame(today, 'month')) {
        startDate = today.toDate();
      } else {
        startDate = newMonth.startOf('month').toDate();
      }
      setStartDate(dayjs(startDate));
      setEndDate(dayjs(endDate));
    }
  };

  const handleEditTour = () => {
    setIsEditing(true);
  };

  const handleEditTourChange = (field, value) => {
    setEditTourData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrices = (adultPrice) => {
    const childPrice = Math.round(adultPrice * 0.6);
    const infantPrice = Math.round(adultPrice * 0.3);
    return { childPrice, infantPrice };
  };

  const validatePrice = (price, minPrice, maxPrice) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return false;
    if (!price) return true;
    return numPrice >= minPrice && numPrice <= maxPrice;
  };

  const handleSaveDraft = async () => {
    // Implement save draft logic
  };

  const handleSubmitEdit = async () => {
    // Implement submit edit logic
  };

  const handleDeleteTour = async () => {
    console.log('Delete tour:', id);
  };

  const canModify = tour?.status === TourStatus.Rejected;

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginLeft: isSidebarOpen ? '245px' : 2, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'grey' }}
            >
              Quay lại
            </Button>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
              Chi tiết tour
            </Typography>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <TourTemplateInfo
              tourTemplate={tourTemplate}
              isLoading={isLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TourCalendar 
                tourId={id} 
                tours={tours} 
                selectedMonth={selectedMonth} 
                handleMonthChange={handleMonthChange} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                {isEditing ? 'Chỉnh sửa tour' : 'Thông tin tour'}
              </Typography>
              {tour && !isEditing && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                    <Typography>Khởi hành từ: {tour.startLocation}</Typography>
                    <Typography>Ngày khởi hành: {dayjs(tour.startDate).format('DD/MM/YYYY')}</Typography>
                    <Typography>Giờ khởi hành: {tour.startTime}</Typography>
                    <Typography>
                      Ngày kết thúc: {(() => {
                        if (!tour.startDate || !tour.startTime || !tourTemplate) return '';
                        const result = calculateEndDate(
                          dayjs(tour.startDate), 
                          dayjs(tour.startDate), 
                          tourTemplate.duration
                        );
                        return result ? result.endDate.format('DD/MM/YYYY') : '';
                      })()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                    <Typography>Số khách tối đa: {tour.maxParticipant}</Typography>
                    <Typography>Số khách tối thiểu: {tour.minParticipant}</Typography>
                    <Typography>Số khách hiện tại: {tour.currentParticipant}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Trạng thái</Typography>
                    <Chip
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: getTourStatusInfo(tour.status).color }} />
                          <Typography sx={{ color: getTourStatusInfo(tour.status).textColor, fontWeight: 600, fontSize: 13 }}>
                            {getTourStatusInfo(tour.status).text}
                          </Typography>
                        </Box>
                      }
                      size="small"
                      sx={{
                        pt: 1.7, pb: 1.7, pr: 0.3,
                        backgroundColor: getTourStatusInfo(tour.status).backgroundColor,
                        fontWeight: 600, '& .MuiChip-label': { px: 1 }
                      }}
                    />
                    
                    {canModify && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          startIcon={<EditIcon />}
                          onClick={handleEditTour}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="medium"
                          startIcon={<DeleteIcon />}
                          onClick={handleDeleteTour}
                        >
                          Xóa
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              )}
              {tour && isEditing && editTourData && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                    <TextField
                      label="Khởi hành từ" fullWidth variant="outlined" sx={{ mb: 1, mt: 1.5 }}
                      value={editTourData.startAddress} inputProps={{ style: { height: '15px' } }}
                      onChange={(e) => handleEditTourChange('startAddress', e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{ mb: 2, mt: 1.5 }}>
                        <DatePicker
                          onChange={(value) => handleEditTourChange('startDate', value)}
                          format="DD/MM/YYYY" minDate={dayjs()} label="Ngày khởi hành" 
                          value={editTourData.startDate}
                          slotProps={{ textField: { fullWidth: true, inputProps: { style: { height: '15px' } } } }}
                        />
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <TimePicker
                          label="Giờ khởi hành" value={editTourData.startTime} 
                          onChange={(value) => handleEditTourChange('startTime', value)}
                          slotProps={{ textField: { fullWidth: true, inputProps: { style: { height: '15px' } } } }}
                        />
                      </Box>
                    </LocalizationProvider>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                    <TextField
                      label="Số khách tối đa" fullWidth type="number" variant="outlined" 
                      sx={{ mb: 2, mt: 1.5 }} value={editTourData.maxParticipants}
                      onChange={(e) => {
                        const newMaxParticipants = Number(e.target.value);
                        if (newMaxParticipants > 0) {
                          handleEditTourChange('maxParticipants', e.target.value);
                        }
                      }}
                      error={Number(editTourData.maxParticipants) <= Number(editTourData.minParticipants) || Number(editTourData.maxParticipants) <= 0}
                      helperText={Number(editTourData.maxParticipants) <= Number(editTourData.minParticipants)
                        ? "Số khách tối đa phải lớn hơn số khách tối thiểu" : ""}
                      inputProps={{ min: 1, style: { height: '15px' } }}
                    />
                    <TextField
                      label="Số khách tối thiểu" fullWidth type="number" variant="outlined" 
                      sx={{ mb: 1 }} value={editTourData.minParticipants}
                      onChange={(e) => {
                        const newMinParticipants = Number(e.target.value);
                        if (newMinParticipants > 0 && (!editTourData.maxParticipants || newMinParticipants < Number(editTourData.maxParticipants))) {
                          handleEditTourChange('minParticipants', e.target.value);
                        }
                      }}
                      error={Number(editTourData.minParticipants) >= Number(editTourData.maxParticipants) || Number(editTourData.minParticipants) <= 0}
                      helperText={Number(editTourData.minParticipants) >= Number(editTourData.maxParticipants)
                        ? "Số khách tối thiểu phải nhỏ hơn số khách tối đa" : ""}
                      inputProps={{ min: 1, style: { height: '15px' } }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
                    <TextField 
                      fullWidth type="number" label="Người lớn (trên 12 tuổi)" variant="outlined" 
                      value={editTourData.adultPrice}
                      onChange={(e) => {
                        const newAdultPrice = e.target.value;
                        if (Number(newAdultPrice) >= 0) {
                          handleEditTourChange('adultPrice', newAdultPrice);
                          if (validatePrice(newAdultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
                            const { childPrice, infantPrice } = calculatePrices(Number(newAdultPrice));
                            handleEditTourChange('childPrice', childPrice.toString());
                            handleEditTourChange('infantPrice', infantPrice.toString());
                          }
                        }
                      }}
                      error={editTourData.adultPrice && (!validatePrice(editTourData.adultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice) || Number(editTourData.adultPrice) < 0)}
                      helperText={`Giá phải từ ${tourTemplate?.minPrice?.toLocaleString() || 0} đến ${tourTemplate?.maxPrice?.toLocaleString() || 0} VND`}
                      sx={{ mb: 2, mt: 1.5 }}
                      inputProps={{ min: 0, style: { height: '15px' } }}
                    />
                    <TextField 
                      fullWidth type="number" label="Trẻ em (5-12 tuổi)" variant="outlined" 
                      value={editTourData.childPrice}
                      onChange={(e) => {
                        const newChildPrice = Number(e.target.value);
                        const adultPrice = Number(editTourData.adultPrice);
                        if (newChildPrice >= 0 && (!adultPrice || newChildPrice <= adultPrice)) {
                          handleEditTourChange('childPrice', e.target.value);
                        }
                      }}
                      sx={{ mb: 2 }}
                      inputProps={{ min: 0, style: { height: '15px' } }}
                      error={Number(editTourData.childPrice) > Number(editTourData.adultPrice) || Number(editTourData.childPrice) < 0}
                      helperText={Number(editTourData.childPrice) > Number(editTourData.adultPrice) ? "Giá trẻ em phải thấp hơn giá người lớn" : ""}
                    />
                    <TextField
                      fullWidth type="number" label="Em bé (dưới 5 tuổi)" variant="outlined" 
                      value={editTourData.infantPrice}
                      onChange={(e) => {
                        const newInfantPrice = Number(e.target.value);
                        const childPrice = Number(editTourData.childPrice);
                        if (newInfantPrice >= 0 && (!childPrice || newInfantPrice <= childPrice)) {
                          handleEditTourChange('infantPrice', e.target.value);
                        }
                      }}
                      sx={{ mb: 1.5 }}
                      inputProps={{ min: 0, style: { height: '15px' } }}
                      error={Number(editTourData.infantPrice) > Number(editTourData.childPrice) || Number(editTourData.infantPrice) < 0}
                      helperText={Number(editTourData.infantPrice) > Number(editTourData.childPrice)
                        ? "Giá em bé phải thấp hơn giá trẻ em" : ""}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{ mb: 2, mt: 1.5 }}>
                        <DatePicker
                          label="Ngày mở đăng ký"
                          value={editTourData.registerOpenDate}
                          onChange={(value) => handleEditTourChange('registerOpenDate', value)}
                          format="DD/MM/YYYY"
                          minDate={dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              inputProps: { style: { height: '15px' } },
                              error: editTourData.registerOpenDate && editTourData.registerCloseDate &&
                                dayjs(editTourData.registerOpenDate).isAfter(editTourData.registerCloseDate),
                              helperText: editTourData.registerOpenDate && editTourData.registerCloseDate &&
                                dayjs(editTourData.registerOpenDate).isAfter(editTourData.registerCloseDate) ?
                                "Ngày mở đăng ký phải trước ngày đóng đăng ký" : ""
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <DatePicker
                          label="Ngày đóng đăng ký"
                          value={editTourData.registerCloseDate}
                          onChange={(value) => handleEditTourChange('registerCloseDate', value)}
                          format="DD/MM/YYYY"
                          minDate={editTourData.registerOpenDate || dayjs()}
                          maxDate={editTourData.startDate}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              inputProps: { style: { height: '15px' } },
                              error: editTourData.registerCloseDate &&
                                dayjs(editTourData.registerCloseDate).isAfter(editTourData.startDate),
                              helperText: editTourData.registerCloseDate &&
                                dayjs(editTourData.registerCloseDate).isAfter(editTourData.startDate) ?
                                "Ngày đóng đăng ký phải trước ngày khởi hành" : ""
                            }
                          }}
                        />
                      </Box>
                    </LocalizationProvider>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      sx={{ backgroundColor: 'grey' }}
                      onClick={handleSaveDraft}
                    >
                      Lưu nháp
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleSubmitEdit}
                    >
                      Gửi
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TourDetail;