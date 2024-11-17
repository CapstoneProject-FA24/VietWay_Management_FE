import React, { useState } from 'react';
import { Card, CardMedia, Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateProvince from './UpdateProvince';
import DeleteProvince from './DeleteProvince';

const ProvinceCard = ({ province, onUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
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
                position: 'relative',
                height: '300px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardMedia
                component="img"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                image={province.imageUrl}
                alt={province.provinceName}
            />
            <Box sx={{ display: 'flex', position: 'absolute', bottom: 12, right: 15, padding: '10px', backgroundColor: 'rgba(30,30,30,0.8)', borderRadius: '10px', alignItems: 'center'}}>
                <Typography variant="h4" component="div" sx={{
                    fontWeight: 'bold', fontSize: '1.8rem', color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,1)', marginRight: '8px'
                }}>
                    {province.provinceName}
                </Typography>
                <IconButton aria-label="more" aria-controls="province-menu" aria-haspopup="true"
                    onClick={handleClick} sx={{ color: 'white', mr: -1.5, ml: -1, filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,1))' }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="province-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'province-menu-button',
                    }}
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
