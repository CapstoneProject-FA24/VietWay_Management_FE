import React, { useState, useEffect } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Select, MenuItem, FormControl, InputLabel, 
    TablePagination, Dialog, Box
} from '@mui/material';
import { getHashtags } from '@services/PublishedPostService';
import HashtagReport from '@components/manager/hashtag/HashtagReport'; // You'll need to create this component

const HashtagList = ({ searchTerm, refreshTrigger }) => {
    const [hashtags, setHashtags] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [reportDialog, setReportDialog] = useState({ open: false, hashtag: null });

    const loadHashtags = async (search = '') => {
        try {
            const data = await getHashtags(search);
            const mappedData = data.map(tag => ({
                ...tag,
                displayDate: new Date(tag.createdAt).toLocaleDateString('vi-VN')
            }));

            if (refreshTrigger) {
                setSortBy('createdAt');
                setHashtags(sortHashtags(mappedData, 'createdAt'));
            } else {
                setHashtags(sortHashtags(mappedData, sortBy));
            }
        } catch (error) {
            console.error('Error loading hashtags:', error);
        }
    };

    const sortHashtags = (tags, sortValue) => {
        return [...tags].sort((a, b) => {
            if (sortValue === 'id') {
                return a.id - b.id;
            } else if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'createdAt') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });
    };

    useEffect(() => {
        loadHashtags(searchTerm);
    }, [searchTerm, refreshTrigger]);

    const handleSort = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        setHashtags(sortHashtags(hashtags, sortValue));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleReportClick = (hashtag) => {
        setReportDialog({ open: true, hashtag });
    };

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120, mb: 2, float: 'right' }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                    value={sortBy}
                    label="Sắp xếp theo"
                    onChange={handleSort}
                >
                    <MenuItem value="id">Mã A-Z</MenuItem>
                    <MenuItem value="name">Tên A-Z</MenuItem>
                    <MenuItem value="createdAt">Mới nhất</MenuItem>
                </Select>
            </FormControl>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Mã</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên Hashtag</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hashtags
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((hashtag) => (
                                <TableRow key={hashtag.id}>
                                    <TableCell align="center">{hashtag.id}</TableCell>
                                    <TableCell align="center">#{hashtag.name}</TableCell>
                                    <TableCell align="center">{hashtag.displayDate}</TableCell>
                                    <TableCell align="center" sx={{ width: '12rem'}}>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleReportClick(hashtag)}
                                        >
                                            Xem thống kê
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={hashtags.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong ${count}`}
                />
            </TableContainer>

            <Dialog
                open={reportDialog.open}
                onClose={() => setReportDialog({ open: false, hashtag: null })}
                maxWidth="lg"
                fullWidth
            >
                <Box sx={{ position: 'relative' }}>
                    <Button
                        onClick={() => setReportDialog({ open: false, hashtag: null })}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 1
                        }}
                    >
                        Đóng
                    </Button>
                    {reportDialog.hashtag && (
                        <HashtagReport
                            hashtagId={reportDialog.hashtag.id}
                        />
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default HashtagList; 