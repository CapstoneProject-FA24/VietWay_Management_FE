import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Chip, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { mockTourTemplates } from '@hooks/MockTourTemplate';
import SidebarStaff from '@layouts/SidebarStaff';

// Styled components
const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '& .MuiSelect-icon': {
    color: 'white',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: 'white',
  margin: '2px',
}));

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const ListTourTemplate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState([]);
  const [tourType, setTourType] = useState([]);
  const [location, setLocation] = useState([]);
  const [filteredTours, setFilteredTours] = useState(mockTourTemplates);

  useEffect(() => {
    filterTours();
  }, [searchTerm, duration, tourType, location]);

  const filterTours = () => {
    let result = mockTourTemplates.filter(tour => 
      tour.TourName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (duration.length === 0 || duration.includes(tour.TourTemplateDuration)) &&
      (tourType.length === 0 || tourType.some(type => tour.TourTemplateCategory.includes(type))) &&
      (location.length === 0 || location.some(loc => tour.TourTemplateProvince.includes(loc)))
    );
    setFilteredTours(result);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleTourTypeChange = (event) => {
    setTourType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Box>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: isSidebarOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên mẫu tour"
            variant="outlined"
            sx={{ flexGrow: 1, mr: 2, backgroundColor: 'white' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" sx={{ whiteSpace: 'nowrap' }}>
            Tạo Mẫu Tour Mới
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Độ dài</InputLabel>
            <Select
              multiple
              value={duration}
              onChange={handleDurationChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="3N2Đ">3N2Đ</MenuItem>
              <MenuItem value="2N1Đ">2N1Đ</MenuItem>
              <MenuItem value="5N4Đ">5N4Đ</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Loại tour</InputLabel>
            <Select
              multiple
              value={tourType}
              onChange={handleTourTypeChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="Tour Thành phố">Tour Thành phố</MenuItem>
              <MenuItem value="Tour Sinh thái">Tour Sinh thái</MenuItem>
              <MenuItem value="Tour Văn hóa">Tour Văn hóa</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Địa điểm</InputLabel>
            <Select
              multiple
              value={location}
              onChange={handleLocationChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="Hồ Chí Minh">Hồ Chí Minh</MenuItem>
              <MenuItem value="Tiền Giang">Tiền Giang</MenuItem>
              <MenuItem value="Thừa Thiên Huế">Thừa Thiên Huế</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Có {filteredTours.length} kết quả trùng khớp
        </Typography>

        <Grid container spacing={2}>
          {filteredTours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.TourTemplateId}>
              <StyledCard>
                <StyledCardMedia
                  image={tour.TourTemplateImages[0].url}
                  title={tour.TourName}
                />
                <StyledCardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {tour.tourTemplateName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tên Tour: {tour.TourName}
                  </Typography>
                  <Typography variant="body2">
                    Địa điểm khởi hành: {tour.TourTemplateDeparturePoint}
                  </Typography>
                  <Typography variant="body2">
                    Giờ khởi hành: {tour.TourTemplateBeginTime}
                  </Typography>
                  <Typography variant="body2">
                    Thời lượng tour: {tour.TourTemplateDuration}
                  </Typography>
                </StyledCardContent>
                <CardActions>
                  <Button size="small" variant='outlined'>Chi tiết</Button>
                  <Button size="small" variant="contained" color="primary">
                    Tạo Tour
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ListTourTemplate;