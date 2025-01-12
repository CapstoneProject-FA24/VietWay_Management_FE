import React from 'react';
import { Grid } from '@mui/material';
import AttractionReviewChart from '@components/manager/attraction/AttractionReviewChart';
import TourTemplateReviewChart from '@components/manager/tour/TourTemplateReviewChart';
import TourTemplateRevenue from '@components/manager/tour/TourTemplateRevenue';
import BookingChart from '@components/manager/tour/BookingChart';
import BookingQuarterChart from '@components/manager/tour/BookingQuarterChart';

const RevenueTab = ({ bookingStats, ratingStats, revenueStats }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {bookingStats.bookingByDay.dates[0]?.includes('Q') ? (
          <BookingQuarterChart bookingData={bookingStats.bookingByDay} />
        ) : (
          <BookingChart bookingData={bookingStats.bookingByDay} />
        )}
      </Grid>
      <Grid item xs={12}>
        <TourTemplateRevenue
          revenueData={revenueStats.revenueByTourTemplate}
          periodData={revenueStats.revenueByPeriod}
        />
      </Grid>
      <Grid item xs={12}>
        <TourTemplateReviewChart
          bookingData={bookingStats.bookingByTourTemplate}
          ratingData={ratingStats.tourTemplateRatingInPeriod}
        />
      </Grid>
      <Grid item xs={12}>
        <AttractionReviewChart
          ratingData={ratingStats.attractionRatingInPeriod}
        />
      </Grid>
    </Grid>
  );
};

export default RevenueTab;
