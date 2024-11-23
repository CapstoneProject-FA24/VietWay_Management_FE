import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Container, Collapse, IconButton, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TemplateAddAttractionPopup from '@components/staff/tourTemplate/TemplateAddAttractionPopup';
import { fetchTourTemplateById, updateTourTemplate, updateTemplateImages } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import PropTypes from 'prop-types';

const TourTemplateUpdateForm = ({ tourTemplate: initialTourTemplate, onSave, onCancel }) => {
    const [tourTemplate, setTourTemplate] = useState(initialTourTemplate);
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

    const handleFieldChange = (field, value) => {
        setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], value } }));
    };

    const handleFieldSubmit = async (fieldName) => {
        try {
            const updatedData = {
                ...initialTourTemplate,
                [fieldName]: editableFields[fieldName].value
            };
            await onSave(updatedData);
            setEditableFields(prev => ({
                ...prev,
                [fieldName]: { ...prev[fieldName], isEditing: false }
            }));
        } catch (error) {
            console.error(`Error updating ${fieldName}:`, error);
        }
    };

    const handleFieldEdit = (field) => {
        setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], isEditing: true } }));
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            setTourTemplate(prev => ({
                ...prev,
                imageUrls: prev.imageUrls.map((img, i) => i === index ? file : img)
            }));
        }
    };

    const handleImageRemove = (index) => {
        setTourTemplate(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.map((img, i) => i === index ? null : img)
        }));
    };

    const handleDayClick = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const handleAddDay = () => {
        const newDay = tourTemplate.schedule.length + 1;
        setTourTemplate(prev => ({
            ...prev,
            schedule: [...prev.schedule, {
                dayNumber: newDay,
                title: '',
                description: '',
                attractions: [],
                isEditing: true
            }]
        }));
        setExpandedDay(newDay);
    };

    const handleRemoveDay = (day) => {
        if (tourTemplate.schedule.length > 1) {
            setTourTemplate(prev => ({
                ...prev,
                schedule: prev.schedule
                    .filter(s => s.dayNumber !== day)
                    .map((s, index) => ({ ...s, Day: index + 1 }))
            }));
            setExpandedDay(null);
        }
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

    const handleScheduleSubmit = (day) => {
        const schedule = tourTemplate.schedule.find(item => item.dayNumber === day);
        if (!schedule) return;

        const isValid = schedule.title?.trim() !== '' &&
            schedule.description?.trim() !== '' &&
            schedule.attractions?.length > 0;

        if (isValid) {
            setTourTemplate(prev => ({
                ...prev,
                schedule: prev.schedule.map(item =>
                    item.dayNumber === day ? { ...item, isEditing: false } : item
                )
            }));
        } else {
            alert('Please ensure all fields are filled before submitting.');
        }
    };

    const handleScheduleEdit = (day) => {
        setTourTemplate(prev => ({
            ...prev,
            schedule: prev.schedule.map(item =>
                item.dayNumber === day ? { ...item, isEditing: true } : item
            )
        }));
        setExpandedDay(day);
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
                note: editableFields.note.value,
                provinceIds: editableFields.provinces.value.map(province => province.value),
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
                const requiredFields = ['tourName', 'description', 'durationId', 'tourCategoryId', 'note', 'provinceIds', 'schedules', 'minPrice', 'maxPrice'];
                const missingFields = requiredFields.filter(field => {
                    if (Array.isArray(tourTemplateData[field])) {
                        return tourTemplateData[field].length === 0;
                    }
                    return !tourTemplateData[field];
                });

                if (missingFields.length > 0) {
                    alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
                    return;
                }
            } else {
                if (!tourTemplateData.durationId || !tourTemplateData.tourCategoryId) {
                    alert('Vui lòng chọn thời lượng và loại tour trước khi lưu bản nháp.');
                    return;
                }
            }

            const response = await updateTourTemplate(tourTemplateData.tourTemplateId, tourTemplateData);

            if (response.statusCode === 200) {
                const newImages = tourTemplate.imageUrls.filter(img => img instanceof File);
                const deletedImageIds = [];

                if (newImages.length > 0 || deletedImageIds.length > 0) {
                    await updateTemplateImages(id, newImages, deletedImageIds);
                }

                alert(isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã cập nhật và gửi tour mẫu thành công.');
                navigate('/nhan-vien/tour-mau');
            } else {
                alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error updating tour template:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    return (
        <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography gutterBottom>Tỉnh thành</Typography>
                <ReactSelect isMulti name="provinces" options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
                    className="basic-multi-select" classNamePrefix="select" placeholder="Chọn tỉnh/thành phố" value={editableFields.provinces.value}
                    onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom>Tên tour</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        value={editableFields.tourName.value} onChange={(e) => handleFieldChange('tourName', e.target.value)}
                        variant="outlined" fullWidth sx={{ mr: 2 }}
                    />
                </Box>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ minWidth: '100%' }}>
                    <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
                        <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                            {tourTemplate.imageUrls[0] ? (
                                <>
                                    <img src={tourTemplate.imageUrls[0] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[0]) : tourTemplate.imageUrls[0]?.imageUrl} alt="Tour image 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                                    <IconButton onClick={() => handleImageRemove(0)}
                                        sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <Button component="label" variant="outlined" sx={{ width: '100%', height: '100%', border: '2px dashed #3572EF' }}>
                                    Thêm ảnh
                                    <input type="file" hidden onChange={(e) => handleImageUpload(0, e)} />
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                                {tourTemplate.imageUrls[1] ? (
                                    <>
                                        <img src={tourTemplate.imageUrls[1] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[1]) : tourTemplate.imageUrls[1]?.imageUrl} alt="Tour image 2" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                                        <IconButton onClick={() => handleImageRemove(1)}
                                            sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Button component="label" variant="outlined" sx={{ width: '100%', height: '100%', border: '2px dashed #3572EF' }}>
                                        Thêm ảnh
                                        <input type="file" hidden onChange={(e) => handleImageUpload(1, e)} />
                                    </Button>
                                )}
                            </Box>
                            <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                                <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                                    {tourTemplate.imageUrls[2] ? (
                                        <>
                                            <img src={tourTemplate.imageUrls[2] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[2]) : tourTemplate.imageUrls[2]?.imageUrl} alt="Tour image 3" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                                            <IconButton onClick={() => handleImageRemove(2)}
                                                sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Button component="label" variant="outlined" sx={{ width: '100%', height: '96%', border: '2px dashed #3572EF' }}>
                                            Thêm ảnh
                                            <input type="file" hidden onChange={(e) => handleImageUpload(2, e)} />
                                        </Button>
                                    )}
                                </Box>
                                <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                                    {tourTemplate.imageUrls[3] ? (
                                        <>
                                            <img src={tourTemplate.imageUrls[3] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[3]) : tourTemplate.imageUrls[3]?.imageUrl} alt="Tour image 4" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                                            <IconButton onClick={() => handleImageRemove(3)}
                                                sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Button component="label" variant="outlined" sx={{ width: '100%', height: '96%', border: '2px dashed #3572EF' }}>
                                            Thêm ảnh
                                            <input type="file" hidden onChange={(e) => handleImageUpload(3, e)} />
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '48%' }}>
                            <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>Thời lượng:</Typography>
                                <Select sx={{ width: '100%', mr: 1 }}
                                    value={editableFields.duration.value}
                                    onChange={(e) => handleFieldChange('duration', e.target.value)}>
                                    {tourDurations.map((tourDuration) => (
                                        <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>{tourDuration.durationName}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '48%' }}>
                            <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '5.3rem' }}>Loại tour:</Typography>
                                <Select sx={{ width: '100%', mr: 1 }}
                                    value={editableFields.tourCategory.value}
                                    onChange={(e) => handleFieldChange('tourCategory', e.target.value)}>
                                    {tourCategories.map((tourCategory) => (
                                        <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.tourCategoryId}>{tourCategory.tourCategoryName}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField value={editableFields.description.value}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                variant="outlined" fullWidth multiline rows={4} sx={{ mr: 2 }} />
                        </Box>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>
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
                                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                                        {`Ngày ${s.dayNumber}`}
                                    </Typography>
                                    <IconButton size="small">
                                        {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Box>
                                <Collapse in={expandedDay === s.dayNumber} sx={{ mt: 1, ml: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Tiêu đề:</Typography>
                                        <TextField value={s.title} onChange={(e) => handleScheduleChange(s.dayNumber, 'title', e.target.value)} variant="outlined" fullWidth />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Mô tả:</Typography>
                                        <TextField value={s.description} onChange={(e) => handleScheduleChange(s.dayNumber, 'description', e.target.value)} variant="outlined" fullWidth multiline rows={3} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Điểm đến:</Typography>
                                        <Button variant="outlined" onClick={() => handleAttractionChange(s.dayNumber)}>
                                            Chọn điểm đến
                                        </Button>
                                        {s.attractions.length > 0 && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="subtitle2">Đã chọn:</Typography>
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
                                {tourTemplate.schedule.length > 1 && (
                                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveDay(s.dayNumber)} sx={{ mt: 2 }}>
                                        Xóa ngày
                                    </Button>
                                )}
                            </Box>
                        ))}
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDay} sx={{ mt: 2 }}>
                            Thêm ngày
                        </Button>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField value={editableFields.note.value} onChange={(e) => handleFieldChange('note', e.target.value)} variant="outlined" fullWidth multiline rows={4} sx={{ mr: 2 }} />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} >
                    <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.createdDate).toLocaleDateString('vi-VN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C' }}>Người tạo: {tourTemplate.creatorName}</Typography>
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
                                type="number"
                                value={editableFields.minPrice.value}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    handleFieldChange('minPrice', newValue);
                                    validatePrice(newValue, editableFields.maxPrice.value);
                                }}
                                variant="outlined"
                                fullWidth
                                placeholder="Giá thấp nhất"
                                inputProps={{ min: 0 }}
                                error={!!priceErrors.minPrice}
                                helperText={priceErrors.minPrice}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                            <Typography sx={{ color: '#05073C', minWidth: '4.2rem' }}> Đến: </Typography>
                            <TextField
                                type="number"
                                value={editableFields.maxPrice.value}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    handleFieldChange('maxPrice', newValue);
                                    validatePrice(editableFields.minPrice.value, newValue);
                                }}
                                variant="outlined"
                                fullWidth
                                placeholder="Giá cao nhất"
                                inputProps={{ min: 0 }}
                                error={!!priceErrors.maxPrice}
                                helperText={priceErrors.maxPrice}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: 'gray', mb: 2, height: '50px', '&:hover': { backgroundColor: '#4F4F4F' } }}
                            onClick={() => handleSubmit(true)}
                        >
                            Lưu bản nháp
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ height: '50px' }}
                            onClick={() => handleSubmit(false)}
                        >
                            Gửi
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <TemplateAddAttractionPopup
                open={isAttractionPopupOpen}
                onClose={() => setIsAttractionPopupOpen(false)}
                onSelectAttraction={handleAttractionSelect}
                provinces={provinces}
                selectedAttractions={tourTemplate.schedule.find(s => s.dayNumber === currentEditingDay)?.attractions || []}
            />
        </Box>
    );
};

TourTemplateUpdateForm.propTypes = {
    tourTemplate: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default TourTemplateUpdateForm;