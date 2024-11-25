import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip
} from '@mui/material';
import { getTourStatusInfo } from '@services/StatusService';

const TourTable = ({ tours }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã tour</TableCell>
            <TableCell>Địa điểm xuất phát</TableCell>
            <TableCell>Ngày khởi hành</TableCell>
            <TableCell>Giờ khởi hành</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Số lượng khách</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tours.map((tour) => (
            <TableRow key={tour.id}>
              <TableCell>{tour.id}</TableCell>
              <TableCell>{tour.startLocation}</TableCell>
              <TableCell>
                {new Date(tour.startDate).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell>{tour.startTime}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TourTable;
