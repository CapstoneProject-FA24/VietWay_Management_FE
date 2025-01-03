import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SocialMediaSummaryByProvince = ({ data }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [orderBy, setOrderBy] = useState('averageScore');
    const [order, setOrder] = useState('desc');
    const [chartType, setChartType] = useState('average');
    const [viewMode, setViewMode] = useState('all');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortData = (dataToSort) => {
        return [...dataToSort].sort((a, b) => {
            let comparison = 0;
            if (orderBy === 'provinceName') {
                comparison = a.provinceName.localeCompare(b.provinceName);
            } else {
                comparison = b[orderBy] - a[orderBy];
            }
            return order === 'desc' ? -comparison : comparison;
        });
    };

    const getAllProvincesData = (type, mode = 'all') => {
        const metricMap = {
            'average': { key: 'Trung bình', value: 'averageScore' },
            'facebook': { key: 'Facebook', value: 'averageFacebookScore' },
            'twitter': { key: 'X (Twitter)', value: 'averageXScore' },
            'tour': { key: 'Tour du lịch', value: 'averageTourTemplateScore' },
            'attraction': { key: 'Điểm tham quan', value: 'averageAttractionScore' },
            'post': { key: 'Bài viết', value: 'averageSitePostScore' }
        };

        let sortedData = [...(data || [])]
            .sort((a, b) => b[metricMap[type].value] - a[metricMap[type].value])
            .map(province => ({
                name: province.provinceName,
                [metricMap[type].key]: province[metricMap[type].value]
            }));

        return mode === 'top10' ? sortedData.slice(0, 10) : sortedData;
    };

    const renderChart = () => (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                    {`${viewMode === 'top10' ? 'Top 10 tỉnh thành' : 'Tất cả tỉnh thành'} - Điểm đánh giá mức độ quan tâm ${{
                            'average': 'trung bình',
                            'facebook': 'trên Facebook',
                            'twitter': 'trên X (Twitter)',
                            'tour': 'của các tour du lịch',
                            'attraction': 'của các điểm tham quan',
                            'post': 'của các bài viết'
                        }[chartType]
                        }`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Chế độ xem</InputLabel>
                        <Select
                            sx={{ fontSize: '0.9rem' }}
                            value={viewMode}
                            label="Chế độ xem"
                            onChange={(e) => setViewMode(e.target.value)}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="top10">Top 10</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200, maxWidth: 300 }}>
                        <InputLabel>Biểu đồ</InputLabel>
                        <Select
                            sx={{ fontSize: '0.9rem' }}
                            value={chartType}
                            label="Biểu đồ"
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <MenuItem value="average">ĐĐGMĐQT trung bình</MenuItem>
                            <MenuItem value="facebook">ĐĐGMĐQT trên Facebook</MenuItem>
                            <MenuItem value="twitter">ĐĐGMĐQT trên X (Twitter)</MenuItem>
                            <MenuItem value="tour">ĐĐGMĐQT của các tour du lịch</MenuItem>
                            <MenuItem value="attraction">ĐĐGMĐQT của các điểm tham quan</MenuItem>
                            <MenuItem value="post">ĐĐGMĐQT của các bài viết</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={getAllProvincesData(chartType, viewMode)}
                    layout="horizontal"
                    margin={{
                        top: 50,
                        right: viewMode === 'top10' ? 100 : 10,
                        left: viewMode === 'top10' ? 70 : -10,
                        bottom: 10,
                    }}
                    barCategoryGap={viewMode === 'top10' ? 20 : 3}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: viewMode === 'top10' ? 15 : 12 }}
                        height={100}
                        angle={-60}
                        textAnchor="end"
                    />
                    <YAxis type="number"
                        label={{
                            value: "Điểm đánh giá mức độ quan tâm",
                            position: "top",
                            offset: 20,
                            style: { fontSize: 16 },
                            dx: 100,
                        }} />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Legend />
                    {chartType === 'average' && <Bar dataKey="Trung bình" fill="#0a9d15" />}
                    {chartType === 'facebook' && <Bar dataKey="Facebook" fill="#1877F2" />}
                    {chartType === 'twitter' && <Bar dataKey="X (Twitter)" fill="#000000" />}
                    {chartType === 'tour' && <Bar dataKey="Tour du lịch" fill="#ad51e2" />}
                    {chartType === 'attraction' && <Bar dataKey="Điểm tham quan" fill="#de5e5e" />}
                    {chartType === 'post' && <Bar dataKey="Bài viết" fill="#ff7300" />}
                </BarChart>
            </ResponsiveContainer>
        </>
    );

    const renderDataTable = () => (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h5' textAlign='center' width={'100%'} fontWeight={'bold'} marginTop={2}>
                    Bảng dữ liệu chi tiết mức độ quan tâm của khách hàng với các tỉnh thành
                </Typography>
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                        value={orderBy}
                        label="Sắp xếp theo"
                        onChange={(e) => handleSort(e.target.value)}
                    >
                        <MenuItem value="provinceName">Tên tỉnh thành</MenuItem>
                        <MenuItem value="averageScore">ĐĐGMĐQT trung bình</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                <TableSortLabel
                                    active={orderBy === 'provinceName'}
                                    direction={orderBy === 'provinceName' ? order : 'asc'}
                                    onClick={() => handleSort('provinceName')}
                                >
                                    Tỉnh thành
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Số bài trên Vietway</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Số bài trên Facebook</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Số bài trên X</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT tham quan</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Tour du lịch</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                <TableSortLabel
                                    active={orderBy === 'averageScore'}
                                    direction={orderBy === 'averageScore' ? order : 'asc'}
                                    onClick={() => handleSort('averageScore')}
                                >
                                    ĐĐGMĐQT trung bình
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT trên Facebook</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT trên X</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT tour</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT điểm tham quan </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>ĐĐGMĐQT bài viết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortData(data || []).map((province) => (
                            <TableRow key={province.provinceId}>
                                <TableCell component="th" scope="row">
                                    {province.provinceName}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.totalSitePost}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.totalFacebookPost}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.totalXPost}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.totalAttraction}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.totalTourTemplate}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageScore.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageFacebookScore.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageXScore.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageTourTemplateScore.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageAttractionScore.toFixed(2)}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{province.averageSitePostScore.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Biểu đồ" />
                    <Tab label="Bảng dữ liệu chi tiết" />
                </Tabs>
            </Box>
            {activeTab === 0 ? renderChart() : renderDataTable()}
        </Box>
    );
};

export default SocialMediaSummaryByProvince;
