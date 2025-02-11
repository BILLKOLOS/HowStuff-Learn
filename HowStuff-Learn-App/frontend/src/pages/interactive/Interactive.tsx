import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

const Interactive: React.FC = () => {
  const [content, setContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContent = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      const results = response.data.results || {};
      
      const extractedContent = Object.entries(results)
        .filter(([_, service]) => service.success)
        .flatMap(([serviceName, service]) =>
          service.data.map((item: any) => ({
            title: item.title || serviceName,
            description: item.subpods ? item.subpods.join(', ') : 'No description available.',
          }))
        );

      setContent(extractedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchContent(searchQuery);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Interactive Search
      </Typography>
      
      <Box display="flex" alignItems="center" gap={2} mb={3} justifyContent="center">
        <TextField
          label="Search for something..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 500 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ p: 2, minWidth: 50 }}
        >
          <SearchIcon />
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress size={50} color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {content.length > 0 ? (
            content.map((item: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" align="center" sx={{ width: '100%' }}>
              No results found. Try searching something else.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Interactive;
