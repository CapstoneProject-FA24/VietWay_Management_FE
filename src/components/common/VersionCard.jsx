import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import dayjs from 'dayjs';
import { EntityModifyAction, EntityType, TourStatus, AttractionStatus, PostStatus, TourTemplateStatus } from '@hooks/Statuses';

const getActionText = (version, entityType) => {
  console.log(entityType);
  if (version.action === EntityModifyAction.Create) return 'Tạo mới';
  if (version.action === EntityModifyAction.Update) return 'Cập nhật';
  if (version.action === EntityModifyAction.Delete) return 'Xóa';

  // Handle ChangeStatus action
  if (version.action === EntityModifyAction.ChangeStatus) {
    switch (entityType) {
      case EntityType.Tour:
        switch (version.newStatus) {
          case TourStatus.Rejected: return 'Từ chối';
          case TourStatus.Accepted: return 'Duyệt';
          case TourStatus.Opened: return 'Mở đăng ký';
          case TourStatus.Closed: return 'Đóng đăng ký';
          case TourStatus.OnGoing: return 'Bắt đầu tour';
          case TourStatus.Completed: return 'Hoàn thành';
          case TourStatus.Cancelled: return 'Hủy tour';
          default: return 'Thay đổi trạng thái';
        }

      case EntityType.Attraction:
      case EntityType.TourTemplate:
      case EntityType.Post:
        switch (version.newStatus) {
          case AttractionStatus.Approved: return 'Duyệt';
          case AttractionStatus.Rejected: return 'Từ chối';
          default: return 'Thay đổi trạng thái';
        }

      default:
        return 'Thay đổi trạng thái';
    }
  }

  return 'Thay đổi';
};

const VersionCard = ({ version, entityType }) => {
  const actionText = getActionText(version, entityType);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      p: 2,
      borderBottom: '1px solid #eee',
      '&:last-child': {
        borderBottom: 'none'
      }
    }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary">
            {dayjs(version.timestamp).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>
        <Typography variant="subtitle2">
          <strong>Thực hiện bởi:</strong> {version.modifierName} ({version.modifierRole === 2 ? 'quản lý' : 'nhân viên'})
        </Typography>
        <Typography variant="body2" color="primary" sx={{ mb: 0.5 }}>
          {actionText}
        </Typography>
        {version.reason && (
          <Typography variant="body2" color="text.secondary">
            Lý do: {version.reason}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VersionCard;
