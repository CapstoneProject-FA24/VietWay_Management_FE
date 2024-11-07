import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAttractionStatusInfo } from '@services/StatusService';

const AttractionInfo = ({ attraction, currentSlide, setCurrentSlide, sliderRef, setSliderRef }) => {
  const settings = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    className: 'attraction-slider',
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (sliderRef) {
      sliderRef.slickGoTo(index);
    }
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
      <Chip label={getAttractionStatusInfo(attraction.status).text} size="small" sx={{ mb: 1, color: `${getAttractionStatusInfo(attraction.status).color}`, bgcolor: `${getAttractionStatusInfo(attraction.status).backgroundColor}` }} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
          {attraction.attractionTypeName}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {attraction.name}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
            <Box className="slick-slider-container" sx={{ height: '450px' }}>
              <Slider ref={setSliderRef} {...settings}>
                {attraction.images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={image.url}
                      alt={`Attraction ${index + 1}`}
                      style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
            {attraction.images.map((image, index) => (
              <Box
                key={index}
                sx={{ width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none' }}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin</Typography>
            <Box dangerouslySetInnerHTML={{ __html: attraction.description }} sx={{
              '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
              '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '100%', margin: '0 auto'
            }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ: </Typography>
            <Typography sx={{ mb: 3 }}>{attraction.address}</Typography>

            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
            <Box sx={{ mb: 3 }}>
              <a href={attraction.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                {attraction.website}
              </a>
            </Box>

            <Typography variant="h4" sx={{ mt: 4, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
            <div dangerouslySetInnerHTML={{ __html: attraction.contactInfo }} />
          </Paper>
          <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
            <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '20px', mb: 2 }}>
              Thông tin tạo điểm tham quan
            </Typography>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Typography sx={{ fontWeight: 700 }}>Mã: </Typography>
              <Typography sx={{ mb: 1, ml: 1, color: 'primary.main' }}>{attraction.attractionId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Typography sx={{ fontWeight: 700 }}>Ngày tạo: </Typography>
              <Typography sx={{ mb: 1, ml: 1 }}>{new Date(attraction.createdDate).toLocaleDateString('en-GB')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Typography sx={{ fontWeight: 700 }}>Tạo bởi: </Typography>
              <Typography sx={{ mb: 1, ml: 1 }}>{attraction.creatorName}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttractionInfo;
