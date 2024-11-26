import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const touristColumns = [
  { id: 'fullName', label: 'Họ tên' },
  { id: 'phoneNumber', label: 'Số điện thoại' },
  { id: 'gender', label: 'Giới tính' },
  { id: 'dateOfBirth', label: 'Ngày sinh' },
  { id: 'price', label: 'Giá vé' }
];

const Participant = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2, textAlign: 'center' }}>
        Không có thông tin khách hàng
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {touristColumns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.touristId}>
              <TableCell>{participant.fullName}</TableCell>
              <TableCell>{participant.phoneNumber}</TableCell>
              <TableCell>{participant.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
              <TableCell>{new Date(participant.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(participant.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Participant;