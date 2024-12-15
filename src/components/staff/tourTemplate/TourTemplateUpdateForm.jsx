import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Container, Collapse, IconButton, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faCalendarAlt, faQrcode, faBus } from '@fortawesome/free-solid-svg-icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TemplateAddAttractionPopup from '@components/staff/tourTemplate/TemplateAddAttractionPopup';
import { fetchTourTemplateById, updateTourTemplate, updateTemplateImages } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        ['clean']
    ]
};

const TourTemplateUpdateForm = ({ tourTemplate: initialTourTemplate, onSave, onCancel }) => {
    const [tourTemplate, setTourTemplate] = useState({
        ...initialTourTemplate,
        imageUrls: Array(4).fill(null).map((_, index) =>
            initialTourTemplate.imageUrls?.[index] || null
        )
    });
    const [provinces, setProvinces] = useState([]);
    const [tourCategories, setTourCategories] = useState([]);
    const [tourDurations, setTourDurations] = useState([]);

    const [editableFields, setEditableFields] = useState({
        tourName: { value: initialTourTemplate.tourName, isEditing: false },
        description: { value: initialTourTemplate.description, isEditing: false },
        note: { value: initialTourTemplate.note, isEditing: false },
        provinces: {
            value: initialTourTemplate.provinces.map(p => ({
                value: p.provinceId,
                label: p.provinceName
            })),
            isEditing: false
        },
        duration: { value: initialTourTemplate.duration.durationId, isEditing: false },
        departurePoint: { value: initialTourTemplate.departurePoint, isEditing: false },
        tourCategory: { value: initialTourTemplate.tourCategoryId, isEditing: false },
        code: { value: initialTourTemplate.code, isEditing: false },
        minPrice: { value: initialTourTemplate.minPrice || '', isEditing: false },
        maxPrice: { value: initialTourTemplate.maxPrice || '', isEditing: false },
        startingProvinceId: { value: initialTourTemplate.startingProvince?.provinceId || '', isEditing: false },
        transportation: { value: initialTourTemplate.transportation || '', isEditing: false }
    });

    const [expandedDay, setExpandedDay] = useState(null);
    const [isAttractionPopupOpen, setIsAttractionPopupOpen] = useState(false);
    const [currentEditingDay, setCurrentEditingDay] = useState(null);
    const pageTopRef = useRef(null);

    const navigate = useNavigate();

    const [priceErrors, setPriceErrors] = useState({
        minPrice: '',
        maxPrice: ''
    });

    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success', 
        hide: 5000 
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
                const duration = await fetchTourDuration();
                const categories = await fetchTourCategory();
                setProvinces(fetchedProvinces.items);
                setTourDurations(duration);
                setTourCategories(categories);
            } catch (error) {
                console.error('Error fetching tour template:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (initialTourTemplate.duration?.durationId) {
            const selectedDuration = tourDurations.find(d => d.durationId === initialTourTemplate.duration.durationId);
            if (selectedDuration) {
                const numberOfDays = selectedDuration.dayNumber;
                const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
                    // Keep existing schedule data if available
                    const existingDay = initialTourTemplate.schedule.find(s => s.dayNumber === (index + 1));
                    if (existingDay) {
                        return existingDay;
                    }
                    // Create new day if doesn't exist
                    return {
                        dayNumber: index + 1,
                        title: '',
                        description: '',
                        attractions: [],
                        isEditing: true
                    };
                });
                setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
            }
        }
    }, [initialTourTemplate.duration?.durationId, tourDurations]);

    const handleFieldChange = (field, value) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: { value }
        }));

        if (field === 'duration') {
            const selectedDuration = tourDurations.find(d => d.durationId === value);
            if (selectedDuration) {
                const numberOfDays = selectedDuration.dayNumber;
                const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
                    // Keep existing schedule data if available
                    const existingDay = tourTemplate.schedule.find(s => s.dayNumber === (index + 1));
                    if (existingDay) {
                        return existingDay;
                    }
                    // Create new day if doesn't exist
                    return {
                        dayNumber: index + 1,
                        title: '',
                        description: '',
                        attractions: [],
                        isEditing: true
                    };
                });
                setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
            }
        }
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            setTourTemplate(prev => ({
                ...prev,
                imageUrls: prev.imageUrls.map((img, i) =>
                    i === index ? file : img
                )
            }));
        }
    };

    const handleImageRemove = (index) => {
        setTourTemplate(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.map((img, i) =>
                i === index ? null : img
            )
        }));
    };

    const handleDayClick = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const handleScheduleChange = (day, field, value) => {
        setTourTemplate(prev => ({
            ...prev,
            schedule: prev.schedule.map(item =>
                item.dayNumber === day ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleAttractionChange = (day) => {
        setCurrentEditingDay(day);
        setIsAttractionPopupOpen(true);
    };

    const handleAttractionSelect = (selectedAttraction) => {
        setTourTemplate(prev => ({
            ...prev,
            schedule: prev.schedule.map(item =>
                item.dayNumber === currentEditingDay
                    ? { ...item, attractions: [...item.attractions, selectedAttraction] }
                    : item
            )
        }));
        setIsAttractionPopupOpen(false);
    };

    const handleRemoveAttraction = (dayNumber, attractionId) => {
        setTourTemplate(prev => ({
            ...prev,
            schedule: prev.schedule.map(item =>
                item.dayNumber === dayNumber
                    ? { ...item, attractions: item.attractions.filter(attr => attr.attractionId !== attractionId) }
                    : item
            )
        }));
    };

    const validatePrice = (minPrice, maxPrice) => {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        let isValid = true;
        const newErrors = {
            minPrice: '',
            maxPrice: ''
        };

        if (min < 0) {
            newErrors.minPrice = 'Giá thấp nhất phải lớn hơn 0';
            isValid = false;
        }

        if (max < 0) {
            newErrors.maxPrice = 'Giá cao nhất phải lớn hơn 0';
            isValid = false;
        }

        if (max && min && max <= min) {
            newErrors.maxPrice = 'Giá cao nhất phải lớn hơn giá thấp nhất';
            isValid = false;
        }

        setPriceErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (isDraft) => {
        try {
            if (!validatePrice(editableFields.minPrice.value, editableFields.maxPrice.value)) {
                return;
            }

            const tourTemplateData = {
                tourTemplateId: initialTourTemplate.tourTemplateId,
                code: editableFields.code.value,
                tourName: editableFields.tourName.value,
                description: editableFields.description.value,
                durationId: editableFields.duration.value,
                tourCategoryId: editableFields.tourCategory.value,
                transportation: editableFields.transportation.value,
                note: editableFields.note.value,
                provinceIds: editableFields.provinces.value.map(province => province.value),
                startingProvinceId: editableFields.startingProvinceId.value,
                schedules: tourTemplate.schedule.map(s => ({
                    dayNumber: s.dayNumber,
                    title: s.title,
                    description: s.description,
                    attractionIds: s.attractions.map(attr => attr.attractionId)
                })),
                minPrice: parseFloat(editableFields.minPrice.value) || null,
                maxPrice: parseFloat(editableFields.maxPrice.value) || null,
                isDraft: isDraft
            };

            if (!isDraft) {
                const errors = {};
                if (!tourTemplateData.provinceIds || tourTemplateData.provinceIds.length === 0) {
                    errors.provinces = 'Vui lòng chọn ít nhất một tỉnh thành';
                }
                if (!tourTemplateData.schedules || tourTemplateData.schedules.length === 0) {
                    errors.schedules = 'Vui lòng thêm ít nhất một lịch trình';
                }
                const invalidSchedules = tourTemplateData.schedules.filter(s =>
                    !s.title || !s.description || !s.attractionIds || s.attractionIds.length === 0
                );
                if (invalidSchedules.length > 0) {
                    errors.scheduleDetails = 'Vui lòng điền đầy đủ thông tin cho tất cả các ngày trong lịch trình';
                }

                const requiredFields = {
                    tourName: 'Tên tour',
                    code: 'Mã tour',
                    description: 'Mô tả',
                    transportation: 'Phương tiện',
                    note: 'Ghi chú',
                    startingProvinceId: 'Điểm khởi hành',
                    minPrice: 'Giá thấp nhất',
                    maxPrice: 'Giá cao nhất'
                };

                Object.entries(requiredFields).forEach(([key, label]) => {
                    if (!tourTemplateData[key]) {
                        errors[key] = `Vui lòng nhập ${label}`;
                    }
                });

                if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                    });
                    return;
                }
            } else {
                const errors = {};
                if (!tourTemplateData.durationId || !tourTemplateData.tourCategoryId) {
                    errors.duration = 'Vui lòng chọn thời lượng và loại tour trước khi lưu bản nháp';
                    setFieldErrors(errors);
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: 'Vui lòng chọn thời lượng và loại tour',
                    });
                    return;
                }
            }

            const response = await updateTourTemplate(tourTemplateData.tourTemplateId, tourTemplateData);

            if (response.statusCode === 200) {
                const newImages = tourTemplate.imageUrls.filter(img => img instanceof File);
                const deletedImageIds = initialTourTemplate.imageUrls
                    .filter(originalImg => !tourTemplate.imageUrls.some(currentImg =>
                        currentImg?.imageUrl === originalImg?.imageUrl))
                    .map(img => img.imageId);

                if (newImages.length > 0 || deletedImageIds.length > 0) {
                    await updateTemplateImages(tourTemplateData.tourTemplateId, newImages, deletedImageIds);
                }

                setSnackbar({
                    open: true,
                    severity: 'success',
                    message: isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã cập nhật và gửi tour mẫu thành công.',
                    hide: 1000
                });

                setTimeout(() => {
                    navigate('/nhan-vien/tour-mau');
                }, 1000);
            }
        } catch (error) {
            console.error('Error updating tour template:', error);
            setSnackbar({
                open: true,
                severity: 'error',
                message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
            });
        }
    };

    const renderImageSlot = (index, dimensions) => {
        const image = tourTemplate.imageUrls[index];

        return image ? (
            <>
                <img
                    src={image instanceof File ? URL.createObjectURL(image) : image.imageUrl}
                    alt={`Tour image ${index + 1}`}
                    style={{
                        width: '100%',
                        height: dimensions.height,
                        objectFit: 'cover'
                    }}
                />
                <IconButton
                    onClick={() => handleImageRemove(index)}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </>
        ) : (
            <Button
                component="label"
                variant="outlined"
                sx={{
                    width: '100%',
                    height: dimensions.buttonHeight || dimensions.height,
                    border: '2px dashed #3572EF'
                }}
            >
                Thêm ảnh
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                />
            </Button>
        );
    };

    const roundToThousand = (price) => {
        if (!price || isNaN(price)) return '';
        return Math.ceil(parseFloat(price) / 1000) * 1000;
    };

    const handlePriceBlur = (field) => {
        const value = editableFields[field].value;
        if (!isNaN(value) && value !== '') {
            const roundedValue = roundToThousand(value).toString();
            handleFieldChange(field, roundedValue);
        }
    };

    return (
        <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <Typography gutterBottom>Tour đi qua tỉnh/thành phố</Typography>
                    <ReactSelect
                        isMulti name="provinces"
                        options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
                        className="basic-multi-select" classNamePrefix="select"
                        placeholder="Chọn tỉnh/thành phố" value={editableFields.provinces.value}
                        onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <Typography gutterBottom>Khởi hành từ:</Typography>
                    <Select
                        value={editableFields.startingProvinceId.value}
                        onChange={(e) => handleFieldChange('startingProvinceId', e.target.value)}
                        displayEmpty fullWidth sx={{ height: '40px', backgroundColor: 'white' }}
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom>Tên tour</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        value={editableFields.tourName.value} onChange={(e) => handleFieldChange('tourName', e.target.value)}
                        error={!!fieldErrors.tourName} helperText={fieldErrors.tourName} variant="outlined" fullWidth
                    />
                </Box>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ minWidth: '100%' }}>
                    <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
                        <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                            {renderImageSlot(0, { height: '450px' })}
                        </Box>
                        <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                                {renderImageSlot(1, { height: '215px' })}
                            </Box>
                            <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                                <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                                    {renderImageSlot(2, { height: '215px', buttonHeight: '96%' })}
                                </Box>
                                <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                                    {renderImageSlot(3, { height: '215px', buttonHeight: '96%' })}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '32%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>Thời lượng:</Typography>
                                <Select sx={{ width: '100%', mr: 1 }}
                                    value={editableFields.duration.value}
                                    onChange={(e) => handleFieldChange('duration', e.target.value)}>
                                    {tourDurations.map((tourDuration) => (
                                        <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>
                                            {tourDuration.durationName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '32%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '5.3rem' }}>Loại tour:</Typography>
                                <Select sx={{ width: '100%', mr: 1 }}
                                    value={editableFields.tourCategory.value}
                                    onChange={(e) => handleFieldChange('tourCategory', e.target.value)}>
                                    {tourCategories.map((tourCategory) => (
                                        <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.tourCategoryId}>
                                            {tourCategory.tourCategoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '32%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '7rem' }}>Phương tiện:</Typography>
                                <Select sx={{ width: '100%', mr: 1 }}
                                    value={editableFields.transportation.value}
                                    onChange={(e) => handleFieldChange('transportation', e.target.value)}>
                                    <MenuItem value="Xe du lịch">Xe du lịch</MenuItem>
                                    <MenuItem value="Máy bay">Máy bay</MenuItem>
                                    <MenuItem value="Tàu hỏa">Tàu hỏa</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                            Tổng quan
                        </Typography>
                        <ReactQuill
                            value={editableFields.description.value} onChange={(value) => handleFieldChange('description', value)}
                            modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '50px' }}
                        />
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 2, mt: 12 }}>
                            Lịch trình
                        </Typography>
                        {tourTemplate.schedule.map((s, index) => (
                            <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative', mb: 3 }}>
                                {(index === 0 || index === tourTemplate.schedule.length - 1) && (
                                    <Box sx={{
                                        position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                                        borderRadius: '50%', border: '2px solid #3572EF', backgroundColor: 'white',
                                        transform: 'translateY(-50%)', zIndex: 1
                                    }} />
                                )}
                                {(index !== 0 && index !== tourTemplate.schedule.length - 1) && (
                                    <Box sx={{
                                        position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px',
                                        borderRadius: '50%', backgroundColor: '#3572EF', transform: 'translateY(-50%)', zIndex: 1
                                    }} />
                                )}
                                {index !== tourTemplate.schedule.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                                        width: '2px', backgroundColor: '#3572EF', zIndex: 0
                                    }} />
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>{`Ngày ${s.dayNumber}`}</Typography>
                                    <IconButton size="small">{expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                                </Box>
                                <Collapse in={expandedDay === s.dayNumber} sx={{ mt: 1, ml: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>Tiêu đề:</Typography>
                                        <TextField value={s.title} onChange={(e) => handleScheduleChange(s.dayNumber, 'title', e.target.value)} variant="outlined" fullWidth />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '600', mb: 1 }}>Mô tả:</Typography>
                                        <ReactQuill
                                            value={s.description} onChange={(value) => handleScheduleChange(s.dayNumber, 'description', value)}
                                            modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>Điểm đến:</Typography>
                                        <Button variant="outlined" onClick={() => handleAttractionChange(s.dayNumber)}>Chọn điểm đến</Button>
                                        {s.attractions.length > 0 && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="subtitle1" sx>Đã chọn:</Typography>
                                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                    {s.attractions.map((attraction) => (
                                                        <li key={attraction.AttractionId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                            <Typography>{attraction.name}</Typography>
                                                            <IconButton size="small" sx={{ ml: 1 }}
                                                                onClick={() => handleRemoveAttraction(s.dayNumber, attraction.attractionId)}>
                                                                <CloseIcon fontSize="small" />
                                                            </IconButton>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        )}
                                    </Box>
                                </Collapse>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                            Lưu ý
                        </Typography>
                        <ReactQuill
                            value={editableFields.note.value} onChange={(value) => handleFieldChange('note', value)}
                            modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} >
                    <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.createdDate).toLocaleDateString('vi-VN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C', display: 'flex' }}>
                                Trạng thái:
                                <Typography sx={{ ml: 1, color: tourTemplate.statusName === 'Bản nháp' ? 'gray' : tourTemplate.statusName === 'Chờ duyệt' ? 'primary.main' : tourTemplate.statusName === 'Đã duyệt' ? 'green' : 'red', }}>{tourTemplate.statusName}</Typography>
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C', display: 'flex', minWidth: '4.2rem' }}> Mã mẫu: </Typography>
                            <TextField value={editableFields.code.value} onChange={(e) => handleFieldChange('code', e.target.value)} variant="outlined" fullWidth placeholder="Nhập mã tour" />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C', minWidth: '4.2rem' }}> Giá từ: </Typography>
                            <TextField
                                type="number" value={editableFields.minPrice.value}
                                onChange={(e) => {
                                    const newValue = e.target.value; handleFieldChange('minPrice', newValue);
                                    validatePrice(newValue, editableFields.maxPrice.value);
                                }}
                                onBlur={() => handlePriceBlur('minPrice')} variant="outlined" fullWidth placeholder="Giá thấp nhất"
                                inputProps={{ min: 0 }} error={!!priceErrors.minPrice} helperText={priceErrors.minPrice}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C', minWidth: '4.2rem' }}> Đến: </Typography>
                            <TextField
                                type="number" value={editableFields.maxPrice.value}
                                onChange={(e) => {
                                    const newValue = e.target.value; handleFieldChange('maxPrice', newValue);
                                    validatePrice(editableFields.minPrice.value, newValue);
                                }}
                                onBlur={() => handlePriceBlur('maxPrice')} variant="outlined" fullWidth placeholder="Giá cao nhất"
                                inputProps={{ min: 0 }} error={!!priceErrors.maxPrice} helperText={priceErrors.maxPrice}
                            />
                        </Box>
                        <Button
                            variant="contained" fullWidth onClick={() => handleSubmit(true)}
                            sx={{ backgroundColor: 'gray', mb: 2, height: '50px', '&:hover': { backgroundColor: '#4F4F4F' } }}                            
                        >Lưu bản nháp</Button>
                        <Button variant="contained" fullWidth sx={{ height: '50px' }} onClick={() => handleSubmit(false)}>Gửi</Button>
                    </Paper>
                </Grid>
            </Grid>
            <TemplateAddAttractionPopup
                open={isAttractionPopupOpen} onClose={() => setIsAttractionPopupOpen(false)}
                onSelectAttraction={handleAttractionSelect} provinces={provinces}
                selectedAttractions={tourTemplate.schedule.find(s => s.dayNumber === currentEditingDay)?.attractions || []}
            />
            <Snackbar
                open={snackbar.open} autoHideDuration={snackbar.hide}
                onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

TourTemplateUpdateForm.propTypes = {
    tourTemplate: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default TourTemplateUpdateForm;