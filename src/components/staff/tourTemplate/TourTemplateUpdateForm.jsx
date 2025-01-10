import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Collapse, IconButton, Select, MenuItem, Snackbar, Alert, FormControl, FormHelperText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ReactSelect from 'react-select';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TemplateAddAttractionPopup from '@components/staff/tourTemplate/TemplateAddAttractionPopup';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@styles/ReactQuill.css';
import { getErrorMessage } from '@hooks/Message';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { fetchPopularProvinces, fetchPopularTourCategories } from '@services/PopularService';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }], ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }], ['blockquote', 'code-block'], ['link', 'image', 'video', 'formula'], ['clean']
    ],
    clipboard: { matchVisual: false }
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
    const [popularProvinces, setPopularProvinces] = useState([]);
    const [popularTourCategories, setPopularTourCategories] = useState([]);

    const [editableFields, setEditableFields] = useState({
        tourName: { value: initialTourTemplate.tourName, isEditing: false },
        description: { value: initialTourTemplate.description, isEditing: false },
        note: { value: initialTourTemplate.note, isEditing: false },
        provinces: {
            value: initialTourTemplate.provinces.map(p => ({ value: p.provinceId, label: p.provinceName })), isEditing: false
        },
        duration: { value: initialTourTemplate.duration.durationId, isEditing: false },
        departurePoint: { value: initialTourTemplate.departurePoint, isEditing: false },
        tourCategory: { value: initialTourTemplate.tourCategoryId, isEditing: false },
        code: { value: initialTourTemplate.code, isEditing: false },
        minPrice: { value: initialTourTemplate.minPrice, isEditing: false },
        maxPrice: { value: initialTourTemplate.maxPrice, isEditing: false },
        startingProvinceId: { value: initialTourTemplate.startingProvince?.provinceId, isEditing: false },
        transportation: { value: initialTourTemplate.transportation, isEditing: false }
    });

    const [expandedDay, setExpandedDay] = useState(null);
    const [isAttractionPopupOpen, setIsAttractionPopupOpen] = useState(false);
    const [currentEditingDay, setCurrentEditingDay] = useState(null);
    const [priceErrors, setPriceErrors] = useState({ minPrice: '', maxPrice: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
    const [fieldErrors, setFieldErrors] = useState({});

    const [hotProvinces, setHotProvinces] = useState([]);
    const [hotCategories, setHotCategories] = useState([]);

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
                    const existingDay = initialTourTemplate.schedule.find(s => s.dayNumber === (index + 1));
                    if (existingDay) {
                        return existingDay;
                    }
                    return { dayNumber: index + 1, title: '', description: '', attractions: [], isEditing: true };
                });
                setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
            }
        }
    }, [initialTourTemplate.duration?.durationId, tourDurations]);

    useEffect(() => {
        const fetchPopularData = async () => {
            try {
                const popularProvincesData = await fetchPopularProvinces();
                const popularTourCategoriesData = await fetchPopularTourCategories();
                
                setPopularProvinces(popularProvincesData);
                setPopularTourCategories(popularTourCategoriesData);

                // Get hot provinces based on initial category
                let hotProvincesData = [];
                if (initialTourTemplate.tourCategoryId) {
                    hotProvincesData = await fetchPopularProvinces(initialTourTemplate.tourCategoryId, 1);
                    setHotProvinces(hotProvincesData);
                }

                // Update the provinces with both popular and hot status
                setEditableFields(prev => ({
                    ...prev,
                    provinces: {
                        ...prev.provinces,
                        value: prev.provinces.value.map(province => ({
                            ...province,
                            isPopular: popularProvincesData.includes(province.value),
                            isHot: hotProvincesData.includes(province.value)
                        }))
                    }
                }));
            } catch (error) {
                console.error('Error fetching popular data:', error);
            }
        };
        fetchPopularData();
    }, [initialTourTemplate.tourCategoryId]);

    const handleCategoryChange = async (categoryId) => {
        try {
            const hotProvinceData = await fetchPopularProvinces(categoryId, 1);
            setHotProvinces(hotProvinceData);
            
            // Update selected provinces with new hot status
            setEditableFields(prev => ({
                ...prev,
                provinces: {
                    ...prev.provinces,
                    value: prev.provinces.value.map(province => ({
                        ...province,
                        isHot: hotProvinceData.includes(province.value)
                    }))
                }
            }));
        } catch (error) {
            console.error('Error fetching hot provinces:', error);
        }
    };

    const handleProvinceChange = async (provinceId) => {
        try {
            const hotCategoriesData = await fetchPopularTourCategories(provinceId);
            setHotCategories(hotCategoriesData);
        } catch (error) {
            console.error('Error fetching hot categories:', error);
        }
    };

    const handleFieldChange = (field, value) => {
        if (field === 'tourCategory') {
            handleCategoryChange(value);
        }
        if (field === 'startingProvinceId') {
            handleProvinceChange(value);
        }
        if (field === 'provinces' && value.length > 0) {
            const lastSelectedProvince = value[value.length - 1].value;
            handleProvinceChange(lastSelectedProvince);
        }

        setEditableFields(prev => ({
            ...prev,
            [field]: { ...prev[field], value }
        }));
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            setTourTemplate(prev => ({
                ...prev, imageUrls: prev.imageUrls.map((img, i) =>
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
        const newErrors = { minPrice: '', maxPrice: '' };
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

            const isEmptyHtml = (html) => {
                if (!html) return true;
                const strippedHtml = html.replace(/<[^>]*>/g, '').trim();
                return !strippedHtml || html === '<p><br></p>';
            };

            const tourTemplateData = {
                tourTemplateId: initialTourTemplate.tourTemplateId,
                code: editableFields.code.value?.trim() || null,
                tourName: editableFields.tourName.value?.trim() || null,
                description: isEmptyHtml(editableFields.description.value) ? '' : editableFields.description.value,
                durationId: editableFields.duration.value || null,
                tourCategoryId: editableFields.tourCategory.value || null,
                transportation: editableFields.transportation.value?.trim() || null,
                note: isEmptyHtml(editableFields.note.value) ? '' : editableFields.note.value,
                provinceIds: editableFields.provinces.value?.map(province => province.value) || [],
                startingProvinceId: editableFields.startingProvinceId.value || null,
                schedules: tourTemplate.schedule?.map(s => ({
                    dayNumber: s.dayNumber,
                    title: s.title?.trim() || '',
                    description: isEmptyHtml(s.description) ? '' : s.description,
                    attractionIds: s.attractions?.map(attr => attr.attractionId) || []
                })) || [],
                minPrice: parseFloat(editableFields.minPrice.value) || null,
                maxPrice: parseFloat(editableFields.maxPrice.value) || null,
                imageUrls: tourTemplate.imageUrls.filter(img => img instanceof File) || [],
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
                    !s.title?.trim() || isEmptyHtml(s.description) || !s.attractionIds || s.attractionIds.length === 0
                );
                if (invalidSchedules.length > 0) {
                    errors.scheduleDetails = 'Vui lòng điền đầy đủ thông tin cho tất cả các ngày trong lịch trình (tiêu đề, mô tả và điểm tham quan)';
                }

                const nonNullImages = tourTemplate.imageUrls.filter(img => img !== null);
                if (nonNullImages.length < 4) {
                    errors.imageUrls = 'Vui lòng thêm đủ 4 ảnh';
                }
                if (!tourTemplateData.durationId) {
                    errors.duration = 'Vui lòng chọn thời lượng';
                }
                if (!tourTemplateData.tourCategoryId) {
                    errors.tourCategory = 'Vui lòng chọn loại tour';
                }

                const requiredFields = {
                    tourName: 'tên tour',
                    code: 'mã tour',
                    description: 'mô tả',
                    transportation: 'phương tiện',
                    startingProvinceId: 'điểm khởi hành',
                    minPrice: 'giá thấp nhất',
                    maxPrice: 'giá cao nhất'
                };

                Object.entries(requiredFields).forEach(([key, label]) => {
                    if (key === 'description') {
                        if (isEmptyHtml(tourTemplateData[key])) {
                            errors[key] = `Vui lòng nhập ${label}`;
                        }
                    } else if (!tourTemplateData[key]) {
                        errors[key] = `Vui lòng nhập ${label}`;
                    }
                });

                if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    setSnackbar({
                        open: true,
                        severity: 'warning',
                        hide: 5000,
                        message: 'Vui lòng nhập đầy đủ thông tin và hình ảnh',
                    });
                    return;
                }
            } else {
                const hasAnyField = !!(
                    editableFields.code.value?.trim() ||
                    editableFields.tourName.value?.trim() ||
                    !isEmptyHtml(editableFields.description.value) ||
                    editableFields.duration.value ||
                    editableFields.tourCategory.value ||
                    !isEmptyHtml(editableFields.note.value) ||
                    editableFields.minPrice.value ||
                    editableFields.maxPrice.value ||
                    (editableFields.provinces.value && editableFields.provinces.value.length > 0) ||
                    editableFields.startingProvinceId.value ||
                    editableFields.transportation.value?.trim() ||
                    tourTemplate.schedule.some(s => 
                        s.title?.trim() || 
                        !isEmptyHtml(s.description) || 
                        (s.attractions && s.attractions.length > 0)
                    )
                );

                const hasAnyImages = tourTemplate.imageUrls.some(img => img !== null);

                if (!hasAnyField && !hasAnyImages) {
                    setSnackbar({
                        open: true,
                        severity: 'warning',
                        hide: 5000,
                        message: 'Vui lòng nhập ít nhất một thông tin hoặc thêm ít nhất một ảnh để lưu nháp',
                    });
                    return;
                }
            }

            const newImages = tourTemplate.imageUrls.filter(img => img instanceof File);
            const deletedImageIds = initialTourTemplate.imageUrls
                .filter(originalImg => !tourTemplate.imageUrls.some(currentImg =>
                    currentImg?.imageUrl === originalImg?.imageUrl))
                .map(img => img.imageId);
            onSave(tourTemplateData, newImages, deletedImageIds);

        } catch (error) {
            console.error('Error updating tour template:', error);
            setSnackbar({
                open: true,
                severity: 'error',
                message: getErrorMessage(error),
            });
        }
    };

    const renderImageSlot = (index, dimensions) => {
        const image = tourTemplate.imageUrls[index];
        return image ? (
            <>
                <img src={image instanceof File ? URL.createObjectURL(image) : image.imageUrl}
                    alt={`Tour image ${index + 1}`} style={{ width: '100%', height: dimensions.height, objectFit: 'cover' }}
                />
                <IconButton
                    onClick={() => handleImageRemove(index)}
                    sx={{
                        position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </>
        ) : (
            <Button
                component="label" variant="outlined"
                sx={{
                    width: '100%', height: dimensions.buttonHeight || dimensions.height,
                    color: fieldErrors.imageUrls ? 'red' : '#3572EF',
                    border: fieldErrors.imageUrls ? '2px dashed red' : '2px dashed #3572EF'
                }}
            >
                Thêm ảnh
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
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
                    <Typography gutterBottom>Tour đi tham quan tỉnh/thành phố *</Typography>
                    <ReactSelect
                        isMulti
                        value={editableFields.provinces.value.map(province => ({
                            value: province.value,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {province.label}
                                    {province.isPopular && (
                                        <LocalFireDepartmentIcon 
                                            sx={{ color: 'red' }}
                                            titleAccess="Tỉnh thành đang được quan tâm nhiều nhất"
                                        />
                                    )}
                                    {province.isHot && (
                                        <LocalFireDepartmentIcon 
                                            sx={{ color: '#ff8f00' }}
                                            titleAccess="Tỉnh thành đang quan tâm đến loại tour này nhiều nhất"
                                        />
                                    )}
                                </div>
                            )
                        }))}
                        onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)}
                        options={provinces.map(province => ({
                            value: province.provinceId,
                            label: province.provinceName,
                            isPopular: popularProvinces.includes(province.provinceId),
                            isHot: hotProvinces.includes(province.provinceId)
                        }))}
                        formatOptionLabel={(option, { context }) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {option.label}
                                {option.isPopular && (
                                    <LocalFireDepartmentIcon 
                                        sx={{ color: 'red' }}
                                        titleAccess="Tỉnh thành đang được quan tâm nhiều nhất"
                                    />
                                )}
                                {option.isHot && (
                                    <LocalFireDepartmentIcon 
                                        sx={{ color: '#ff8f00' }}
                                        titleAccess="Tỉnh thành đang quan tâm đến loại tour này nhiều nhất"
                                    />
                                )}
                            </div>
                        )}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder=''
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: fieldErrors.provinces ? 'red' : base.borderColor,
                                height: '55px'
                            })
                        }}
                    />
                    {fieldErrors.provinces && (
                        <Typography color="error" variant="caption">{fieldErrors.provinces}</Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <Typography gutterBottom>Khởi hành từ *</Typography>
                    <Select
                        value={editableFields.startingProvinceId.value}
                        onChange={(e) => handleFieldChange('startingProvinceId', e.target.value)}
                        error={!!fieldErrors.startingProvinceId}
                        variant="outlined"
                        fullWidth
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province.provinceId} value={province.provinceId}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {province.provinceName}
                                    {popularProvinces.includes(province.provinceId) && (
                                        <LocalFireDepartmentIcon 
                                            sx={{ color: 'red', ml: 1 }}
                                            titleAccess="Tỉnh thành đang được quan tâm nhiều nhất"
                                        />
                                    )}
                                    {hotProvinces.includes(province.provinceId) && (
                                        <LocalFireDepartmentIcon 
                                            sx={{ color: '#ff8f00', ml: 1 }}
                                            titleAccess="Tỉnh thành đang quan tâm đến loại tour này nhiều nhất"
                                        />
                                    )}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                    {fieldErrors.startingProvinceId && (
                        <FormHelperText error>{fieldErrors.startingProvinceId}</FormHelperText>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom>Tên tour *</Typography>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                                    <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Thời lượng *</Typography>
                                    <Select
                                        sx={{ width: '100%' }} value={editableFields.duration.value}
                                        onChange={(e) => handleFieldChange('duration', e.target.value)}
                                        error={!!fieldErrors.duration}
                                    >
                                        {tourDurations.map((tourDuration) => (
                                            <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>
                                                {tourDuration.durationName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                {fieldErrors.duration && (
                                    <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.duration}</FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                                    <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Loại tour *</Typography>
                                    <Select
                                        value={editableFields.tourCategory.value}
                                        onChange={(e) => handleFieldChange('tourCategory', e.target.value)}
                                        error={!!fieldErrors.tourCategory}
                                        variant="outlined"
                                        fullWidth
                                    >
                                        {tourCategories.map((category) => (
                                            <MenuItem key={category.tourCategoryId} value={category.tourCategoryId}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {category.tourCategoryName}
                                                    {popularTourCategories.includes(category.tourCategoryId) && (
                                                        <LocalFireDepartmentIcon 
                                                            sx={{ color: 'red', ml: 1 }}
                                                            titleAccess="Loại tour đang được quan tâm nhiều nhất"
                                                        />
                                                    )}
                                                    {hotCategories.includes(category.tourCategoryId) && (
                                                        <LocalFireDepartmentIcon 
                                                            sx={{ color: '#ff8f00', ml: 1 }}
                                                            titleAccess="Loại tour đang được quan tâm nhiều nhất tại tỉnh thành này"
                                                        />
                                                    )}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                {fieldErrors.tourCategory && (
                                    <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.tourCategory}</FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
                                    <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Phương tiện *</Typography>
                                    <Select
                                        value={editableFields.transportation.value} error={!!fieldErrors.transportation}
                                        onChange={(e) => handleFieldChange('transportation', e.target.value)} sx={{ width: '100%' }}
                                    >
                                        <MenuItem value="Xe du lịch">Xe du lịch</MenuItem>
                                        <MenuItem value="Máy bay">Máy bay</MenuItem>
                                        <MenuItem value="Tàu hỏa">Tàu hỏa</MenuItem>
                                    </Select>
                                </Box>
                                {fieldErrors.transportation && (
                                    <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.transportation}</FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan *</Typography>
                        <FormControl sx={{ width: '100%' }}>
                            <ReactQuill
                                value={editableFields.description.value} onChange={(value) => handleFieldChange('description', value)}
                                modules={quillModules} theme="snow" className={fieldErrors.description ? "ql-error" : null}
                                style={{ height: '200px', marginBottom: '100px' }}
                            />
                            {fieldErrors.description && (
                                <FormHelperText error sx={{ mt: -3 }}>{fieldErrors.description}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 2, mt: 12 }}>
                            Lịch trình *
                        </Typography>
                        {fieldErrors.scheduleDetails && (
                            <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                                {fieldErrors.scheduleDetails}
                            </Typography>
                        )}
                        {tourTemplate.schedule.map((s, index) => (
                            <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative', mb: 3 }}>
                                {(index === 0 || index === tourTemplate.schedule.length - 1) && (
                                    <Box sx={{
                                        position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                                        borderRadius: '50%', border: fieldErrors.scheduleDetails ? '2px solid red' : '2px solid #3572EF', backgroundColor: 'white',
                                        transform: 'translateY(-50%)', zIndex: 1
                                    }} />
                                )}
                                {(index !== 0 && index !== tourTemplate.schedule.length - 1) && (
                                    <Box sx={{
                                        position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px',
                                        borderRadius: '50%', backgroundColor: fieldErrors.scheduleDetails ? 'red' : '#3572EF', transform: 'translateY(-50%)', zIndex: 1
                                    }} />
                                )}
                                {index !== tourTemplate.schedule.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                                        width: '2px', backgroundColor: fieldErrors.scheduleDetails ? 'red' : '#3572EF', zIndex: 0
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
                                                <Typography variant="subtitle1">Đã chọn:</Typography>
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
                        <FormControl sx={{ width: '100%' }}>
                            <ReactQuill
                                value={editableFields.note.value} onChange={(value) => handleFieldChange('note', value)}
                                modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }}
                                className={fieldErrors.note ? "ql-error" : null}
                            />
                            {fieldErrors.note && (<FormHelperText error sx={{ mt: -3 }}>{fieldErrors.note}</FormHelperText>)}
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} >
                    <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ color: '#05073C', display: 'flex', width: '7rem' }}> Mã mẫu * </Typography>
                            <TextField
                                value={editableFields.code.value} onChange={(e) => handleFieldChange('code', e.target.value)} variant="outlined"
                                fullWidth error={!!fieldErrors.code} helperText={fieldErrors.code}
                            />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C', mt: 1 }}>Giá tour</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ color: '#05073C', width: '7rem' }}> Giá từ * </Typography>
                            <TextField
                                type="number" value={editableFields.minPrice.value} inputProps={{ min: 0 }}
                                onChange={(e) => {
                                    const newValue = e.target.value; handleFieldChange('minPrice', newValue);
                                    validatePrice(newValue, editableFields.maxPrice.value);
                                }}
                                onBlur={() => handlePriceBlur('minPrice')} variant="outlined" fullWidth
                                error={!!priceErrors.minPrice || !!fieldErrors.minPrice}
                                helperText={priceErrors.minPrice || fieldErrors.minPrice}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ color: '#05073C', width: '7rem' }}> Giá đến * </Typography>
                            <TextField
                                type="number" value={editableFields.maxPrice.value} inputProps={{ min: 0 }}
                                onChange={(e) => {
                                    const newValue = e.target.value; handleFieldChange('maxPrice', newValue);
                                    validatePrice(editableFields.minPrice.value, newValue);
                                }}
                                onBlur={() => handlePriceBlur('maxPrice')} variant="outlined" fullWidth
                                error={!!priceErrors.maxPrice || !!fieldErrors.maxPrice}
                                helperText={priceErrors.maxPrice || fieldErrors.maxPrice}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {(tourTemplate.status !== 1 && tourTemplate.status !== 2) && (
                    <Button
                        variant="contained" fullWidth onClick={() => handleSubmit(true)}
                        sx={{ backgroundColor: 'gray', height: '50px', '&:hover': { backgroundColor: '#4F4F4F' }, width: 'fit-content' }}
                    >Lưu bản nháp</Button>
                )}
                <Button variant="contained" fullWidth sx={{ height: '50px', width: 'fit-content' }} onClick={() => handleSubmit(false)} >{(tourTemplate.status === 1) ? 'Lưu' : 'Gửi duyệt'}</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ mt: 1, width: '32rem' }}>
                    <Typography sx={{ color: 'red' }}>- Nếu lưu nháp: Vui lòng nhập ít nhất 1 thông tin để lưu nháp.</Typography>
                    <Typography sx={{ color: 'red' }}>- Nếu gửi duyệt: Vui lòng nhập các trường có dấu * và thêm đầy đủ hình ảnh.</Typography>
                </Box>
            </Box>
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
        </Box >
    );
};

TourTemplateUpdateForm.propTypes = {
    tourTemplate: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default TourTemplateUpdateForm;