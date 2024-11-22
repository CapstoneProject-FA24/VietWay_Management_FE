import React, { useState } from 'react';
import { Card, CardMedia, Box, Typography, IconButton, Menu, MenuItem, Chip, Slide } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateProvince from './UpdateProvince';
import DeleteProvince from './DeleteProvince';

const ProvinceCard = ({ province, onUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            sx={{
                maxWidth: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 0px 8px rgba(0,0,0,0.3)',
                position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardMedia
                component="img"
                height="100%"
                image={province.imageUrl}
                alt={province.provinceName}
                sx={{ objectFit: 'cover' }}
            />
            
            {/* Gradient Overlay */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: isHovered 
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 55%)'
                    : 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 72%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '16px'
            }}>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        color: 'white',
                        mb: isHovered ? 0.5 : -0.2,
                        textShadow: '1px 1px 2px rgba(0,0,0,1)'
                    }}
                >
                    {province.provinceName}
                </Typography>

                {isHovered && (
                    <Slide direction="up" in={isHovered}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '0.9rem',
                                color: 'lightGray',
                                mb: -0.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {province.description || 'Không có mô tả'}
                        </Typography>
                    </Slide>
                )}
            </Box>

            {/* Menu Button */}
            <Box sx={{
                position: 'absolute',
                top: '16px',
                right: '16px',
            }}>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        backgroundColor: 'white',
                        width: '35px',
                        height: '35px',
                        '&:hover': { backgroundColor: 'white' }
                    }}
                >
                    <MoreVertIcon sx={{ color: '#666', fontSize: '23px' }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => setUpdateDialogOpen(true)}>Cập nhật</MenuItem>
                    <MenuItem onClick={() => setDeleteDialogOpen(true)}>Xóa</MenuItem>
                </Menu>
            </Box>

            <UpdateProvince
                open={updateDialogOpen}
                handleClose={() => setUpdateDialogOpen(false)}
                province={province}
                onUpdateSuccess={onUpdate}
            />
            <DeleteProvince
                open={deleteDialogOpen}
                handleClose={() => setDeleteDialogOpen(false)}
                province={province}
                onDeleteSuccess={onUpdate}
            />
        </Card>
    );
};

export default ProvinceCard;
