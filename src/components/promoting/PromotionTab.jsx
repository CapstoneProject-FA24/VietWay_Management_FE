import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import PromotionSummary from './PromotionSummary';
import SocialMediaSummaryByProvince from './SocialMediaSummaryByProvince';
import SocialMediaPostCategory from './SocialMediaPostCategory';
import SocialMediaAttractionCategory from './SocialMediaAttractionCategory';
import SocialMediaTourCategory from './SocialMediaTourCategory';
import ProvinceSocialMetrics from './ProvinceSocialMetrics';

const PromotionTab = ({ 
  socialMediaData, 
  promotionData, 
  provinceData, 
  postCategoryData, 
  attractionCategoryData, 
  tourCategoryData, 
  startDate, 
  endDate 
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
            Thống kê tương tác trên mạng xã hội
          </Typography>
          <PromotionSummary
            socialMediaData={socialMediaData}
            promotionData={promotionData}
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
            Thống kê mức độ quan tâm đến các tỉnh thành
          </Typography>
          <SocialMediaSummaryByProvince data={provinceData} startDate={startDate} endDate={endDate}/>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
            Thống kê mức độ quan tâm theo danh mục bài viết
          </Typography>
          <SocialMediaPostCategory data={postCategoryData} startDate={startDate} endDate={endDate}/>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
            Thống kê mức độ quan tâm theo loại điểm tham quan
          </Typography>
          <SocialMediaAttractionCategory data={attractionCategoryData} startDate={startDate} endDate={endDate}/>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
            Thống kê mức độ quan tâm theo loại tour
          </Typography>
          <SocialMediaTourCategory data={tourCategoryData} startDate={startDate} endDate={endDate}/>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PromotionTab;
