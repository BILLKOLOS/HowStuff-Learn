import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Typography, Button, Box, Card, CardContent } from '@mui/material';

interface Lecture {
  id: string;
  title: string;
  description: string;
  content: string;
  startTime?: string; // Add other properties as needed
}

const Lecture: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Lecture>(`http://localhost:5000/api/lectures/${id}`);
        setLecture(response.data);
      } catch (err) {
        console.error('Error fetching lecture:', err);
        setError('Unable to load lecture data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!lecture) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No lecture found.</Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box mt={4} mx="auto" maxWidth={800}>
      <Button variant="outlined" onClick={handleGoBack} sx={{ mb: 2 }}>
        Go Back
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {lecture.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {lecture.startTime && `Starts at: ${new Date(lecture.startTime).toLocaleString()}`}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {lecture.description}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {lecture.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Lecture;
