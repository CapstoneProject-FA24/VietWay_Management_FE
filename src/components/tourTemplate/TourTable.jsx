import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Chip, IconButton, Collapse, Typography, Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getTourStatusInfo } from '@services/StatusService';
import BookingByTemplate from '@components/tourTemplate/BookingByTemplate';

const TourRow = ({ tour }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: '#f8f9fa',
          '& > *': {
            borderTop: '2px solid #5a6b89',
            '&:first-of-type': { borderLeft: '2px solid #5a6b89' },
            '&:last-of-type': { borderRight: '2px solid #5a6b89' }
          }
        }}
      >
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
          }).format(tour.defaultTouristPrice)}
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
          <Button
            variant="contained" size="small" component={Link}
            sx={{ fontSize: '0.75rem', minWidth: '75px' }}
            to={`/quan-ly/tour-du-lich/chi-tiet/${tour.id}`}
          >
            Chi tiết
          </Button>
        </TableCell>
        <TableCell>
          {tour.totalBookings > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              sx={{ borderRadius: 2 }}
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#fff',
            borderLeft: '2px solid #5a6b89',
            borderRight: '2px solid #5a6b89',
            borderBottom: '2px solid #5a6b89'
          }}
          colSpan={9}
        >
          {tour.totalBookings > 0 && (
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ borderTop: '1px solid #8a98b0' }}>
              <Box sx={{ margin: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    backgroundColor: '#f8f9fa',
                    padding: '8px',
                    borderRadius: '4px',
                    color: '#5a6b89'
                  }}
                >
                  Danh sách booking
                </Typography>
                <BookingByTemplate tourId={tour.id} />
              </Box>
            </Collapse>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

const TourTable = ({ tours }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ border: '2px solid #5a6b89' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Mã tour</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Địa điểm xuất phát</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Thời gian khởi hành</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Giá</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Số lượng khách</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Số booking</TableCell>
            <TableCell/>
            <TableCell aria-label="expand"/>
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
