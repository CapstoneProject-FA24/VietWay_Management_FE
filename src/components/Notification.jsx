import React, { useState } from 'react';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';

const Notification = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Tour mới được tạo',
      message: 'Tour "Hà Nội - Sapa" đã được tạo và đang chờ duyệt.',
      time: '5 phút trước',
      isRead: false
    },
    {
      id: 2,
      title: 'Booking mới',
      message: 'Có booking mới cho tour "Hà Nội - Hạ Long".',
      time: '1 giờ trước',
      isRead: false
    },
    {
      id: 3,
      title: 'Tour được duyệt',
      message: 'Tour "Hà Nội - Ninh Bình" đã được duyệt.',
      time: '2 giờ trước',
      isRead: true
    }
  ]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          backgroundColor: '#fff',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ color: '#2196f3' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thông báo
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem 
                alignItems="flex-start"
                onClick={() => handleMarkAsRead(notification.id)}
                sx={{ 
                  bgcolor: notification.isRead ? 'transparent' : 'rgba(33, 150, 243, 0.04)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                  cursor: 'pointer',
                  borderRadius: 1,
                  position: 'relative'
                }}
              >
                {!notification.isRead && (
                  <CircleIcon 
                    sx={{ 
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#2196f3',
                      fontSize: 12
                    }} 
                  />
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{ 
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        fontSize: '0.95rem'
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ 
                          display: 'block',
                          mb: 0.5,
                          fontWeight: notification.isRead ? 'normal' : 500
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && (
                <Divider variant="inset" component="li" sx={{ ml: 0 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Notification;