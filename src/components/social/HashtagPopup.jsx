import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Chip, Box, Typography, CircularProgress, Paper
} from '@mui/material';
import { getHashtags } from '@services/PublishedPostService';
import { getPopularHashtags } from '@services/PopularService';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const HashtagPopup = ({ open, onClose, onConfirm, title = "Thêm hashtag", isTwitter }) => {
  const [hashtags, setHashtags] = useState([]);
  const [popularHashtags, setPopularHashtags] = useState([]);
  const [allHashtags, setAllHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const fetchHashtags = async () => {
      setIsLoading(true);
      try {
        const [hashtagList, popularIds] = await Promise.all([
          getHashtags(),
          getPopularHashtags(isTwitter)
        ]);
        
        setAllHashtags(hashtagList);
        
        const hashtagMap = new Map(
          hashtagList.map(hashtag => [hashtag.id, hashtag.name])
        );
        
        const popularHashtagsList = popularIds
          .map(id => hashtagMap.get(id))
          .filter(Boolean); 
        
        setPopularHashtags(popularHashtagsList);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (open) {
      fetchHashtags();
      setSelectedHashtags([]);
      setInputValue('');
      setSuggestions([]);
    }
  }, [open]);

  useEffect(() => {
    console.log(popularHashtags);
    if (inputValue.trim()) {
      const searchTerm = inputValue.toLowerCase();
      const filtered = allHashtags
        .filter(tag => 
          tag.name.toLowerCase().includes(searchTerm) &&
          !selectedHashtags.includes(tag.name)
        )
        .map(tag => ({
          name: tag.name,
          isPopular: popularHashtags.includes(tag.name),
          popularIndex: popularHashtags.indexOf(tag.name) // Add index for sorting
        }))
        .sort((a, b) => {
          if (a.isPopular && b.isPopular) {
            // If both are popular, sort by their original order
            return a.popularIndex - b.popularIndex;
          }
          // Otherwise, popular ones go to top
          return b.isPopular - a.isPopular;
        })
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
    } else {
      // Show all hashtags with popular ones at top when input is empty
      const allSuggestions = allHashtags
        .filter(tag => !selectedHashtags.includes(tag.name))
        .map(tag => ({
          name: tag.name,
          isPopular: popularHashtags.includes(tag.name),
          popularIndex: popularHashtags.indexOf(tag.name) // Add index for sorting
        }))
        .sort((a, b) => {
          if (a.isPopular && b.isPopular) {
            // If both are popular, sort by their original order
            return a.popularIndex - b.popularIndex;
          }
          if (a.isPopular !== b.isPopular) {
            // One is popular, one isn't
            return b.isPopular - a.isPopular;
          }
          // Neither is popular, sort alphabetically
          return a.name.localeCompare(b.name);
        });
      setSuggestions(allSuggestions);
    }
  }, [inputValue, allHashtags, selectedHashtags, popularHashtags]);

  const handleClose = () => {
    setSelectedHashtags([]);
    setInputValue('');
    setSuggestions([]);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(selectedHashtags.map(tag => 
      tag.startsWith('#') ? tag : `#${tag}`
    ));
    handleClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  const handleAddHashtag = (tag) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!selectedHashtags.includes(formattedTag)) {
      setSelectedHashtags([...selectedHashtags, formattedTag]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      handleAddHashtag(newTag);
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="medium" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '80vh',
          height: '67vh',
          width:'50vw'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #e0e0e0',
        fontWeight: 600,
        pb: 2
      }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedHashtags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      setSelectedHashtags(selectedHashtags.filter((_, i) => i !== index));
                    }}
                    icon={popularHashtags.includes(tag.substring(1)) ? 
                      <LocalFireDepartmentIcon sx={{ color: 'red' }} /> : null
                    }
                    sx={{
                      m: 0.5,
                      '& .MuiChip-deleteIcon': {
                        color: '#666',
                        '&:hover': { color: '#f44336' }
                      }
                    }}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                placeholder="Nhập hashtag và nhấn Enter"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            </Box>

            {showSuggestions && suggestions.length > 0 && (
              <Paper 
                elevation={3}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  mt: -1
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    onClick={() => handleAddHashtag(suggestion.name)}
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      },
                      borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none'
                    }}
                  >
                    <Typography sx={{ flex: 1 }}>#{suggestion.name}</Typography>
                    {suggestion.isPopular && (
                      <LocalFireDepartmentIcon 
                        sx={{ color: 'red' }}
                        titleAccess="Hashtag phổ biến"
                      />
                    )}
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        borderTop: '1px solid #e0e0e0',
        p: 2
      }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#666',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HashtagPopup; 