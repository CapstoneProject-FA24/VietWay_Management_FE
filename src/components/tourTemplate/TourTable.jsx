import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Chip, IconButton, Collapse, Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getTourStatusInfo } from '@services/StatusService';
import BookingByTemplate from '@components/tourTemplate/BookingByTemplate';

const TourRow = ({ tour }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderTop: '2px solid rgba(224, 224, 224, 1)' } }}>
        <TableCell>{tour.id}</TableCell>
        <TableCell>{tour.startLocation}</TableCell>
        <TableCell>
          {`${new Date(tour.startDate).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })} ${tour.startTime}`}
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(tour.price)}
        </TableCell>
        <TableCell>
          {`${tour.currentParticipant}/${tour.maxParticipant}`}
        </TableCell>
        <TableCell>
          <Chip
            label={getTourStatusInfo(tour.status).text}
            size="small"
            sx={{
              color: getTourStatusInfo(tour.status).color,
              bgcolor: getTourStatusInfo(tour.status).backgroundColor
            }}
          />
        </TableCell>
        <TableCell>{tour.totalBookings}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: '2px solid rgba(224, 224, 224, 1)'
          }}
          colSpan={8}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Danh sách booking
              </Typography>
              <BookingByTemplate tourId={tour.id} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TourTable = ({ tours }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã tour</TableCell>
            <TableCell>Địa điểm xuất phát</TableCell>
            <TableCell>Thời gian khởi hành</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Số lượng khách</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Số booking</TableCell>
            <TableCell aria-label="expand" />
          </TableRow>
        </TableHead>
        <TableBody>
          {tours.map((tour) => (
              <TourRow key={tour.id} tour={tour} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TourTable;
