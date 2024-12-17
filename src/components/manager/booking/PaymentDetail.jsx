import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Chip } from '@mui/material';
import { getPaymentStatusInfo } from '@services/StatusService';

const paymentColumns = [
  { id: 'paymentId', label: 'Mã giao dịch' },
  { id: 'amount', label: 'Số tiền' },
  { id: 'bankCode', label: 'Ngân hàng' },
  { id: 'bankTransactionNumber', label: 'Mã giao dịch ngân hàng' },
  { id: 'note', label: 'Ghi chú' },
  { id: 'createAt', label: 'Thời gian' },
  { id: 'status', label: 'Trạng thái' }
];

const PaymentDetail = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2, textAlign: 'center' }}>
        Không có lịch sử thanh toán
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {paymentColumns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.paymentId}>
              <TableCell>{payment.paymentId}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(payment.amount)}
              </TableCell>
              <TableCell>{payment.bankCode}</TableCell>
              <TableCell>{payment.bankTransactionNumber}</TableCell>
              <TableCell>{payment.note}</TableCell>
              <TableCell>{new Date(payment.createAt).toLocaleString('vi-VN')}</TableCell>
              <TableCell>
                <Chip
                  label={getPaymentStatusInfo(payment.status).text}
                  sx={{
                    backgroundColor: getPaymentStatusInfo(payment.status).color,
                    color: '#000000',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: getPaymentStatusInfo(payment.status).color,
                      opacity: 0.9
                    }
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

export default PaymentDetail;