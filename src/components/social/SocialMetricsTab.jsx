import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InfoIcon from '@mui/icons-material/Info';

const SocialMetricsTab = ({ post, socialMetrics, handleViewOnSocial }) => (
  <Box sx={{ mt: 3 }}>
    {post?.socialPostDetail?.find(post => post.site === 1) && (
      <>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <XIcon /> Tương tác trên Twitter
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'auto', mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày đăng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt thích</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đăng lại</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trả lời</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt xem</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trích dẫn</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Dấu trang</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {socialMetrics.twitter && socialMetrics.twitter.length > 0 ? (
                socialMetrics.twitter.map((metrics, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(metrics.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </TableCell>
                    <TableCell align="center">{metrics.likeCount}</TableCell>
                    <TableCell align="center">{metrics.retweetCount}</TableCell>
                    <TableCell align="center">{metrics.replyCount}</TableCell>
                    <TableCell align="center">{metrics.impressionCount}</TableCell>
                    <TableCell align="center">{metrics.quoteCount}</TableCell>
                    <TableCell align="center">{metrics.bookmarkCount}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewOnSocial('twitter', metrics.xTweetId)}
                        sx={{ backgroundColor: '#b9b9b9', '&:hover': { backgroundColor: '#939393' }, color: 'black' }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Chưa có dữ liệu thống kê
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </>
    )}

    {post?.socialPostDetail?.find(post => post.site === 0) && (
      <>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FacebookIcon /> Tương tác trên Facebook
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'auto', mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày đăng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt thích</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Chia sẻ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bình luận</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt xem</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {socialMetrics.facebook && socialMetrics.facebook.length > 0 ? (
                socialMetrics.facebook.map((metrics, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(metrics.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={
                        <Box>
                          {Object.entries(metrics.reactionDetails || {}).map(([type, count]) => (
                            <Typography key={type} variant="body2">{type}: {count}</Typography>
                          ))}
                        </Box>
                      }>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <span>{metrics.reactionCount}</span>
                          <InfoIcon sx={{ fontSize: '16px', color: 'grey', cursor: 'help', ml: 1, mt: -0.5 }} />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{metrics.shareCount}</TableCell>
                    <TableCell align="center">{metrics.commentCount}</TableCell>
                    <TableCell align="center">{metrics.impressionCount}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewOnSocial('facebook', metrics.facebookPostId)}
                        sx={{ backgroundColor: '#b9b9b9', '&:hover': { backgroundColor: '#939393' }, color: 'black' }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Chưa có dữ liệu thống kê
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </>
    )}

    {!post?.socialPostDetail?.find(post => post.site === 1) && !post?.facebookPostId && (
      <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
        Chưa có bài đăng trên mạng xã hội
      </Typography>
    )}
  </Box>
);

export default SocialMetricsTab; 