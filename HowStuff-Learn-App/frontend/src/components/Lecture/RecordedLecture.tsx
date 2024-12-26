// src/components/Lecture/RecordedLecture.tsx
import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';

const RecordedLecture = () => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedback);
  };

  return (
    <div>
      <Typography variant="h4">Recorded Lecture: Advanced Chemistry</Typography>
      <Box sx={{ width: '100%', height: 400, backgroundColor: '#ccc', marginBottom: 2 }}>
        <Typography variant="h6">Recorded Video (Placeholder)</Typography>
      </Box>

      <Box>
        <Typography variant="h6">Provide Feedback:</Typography>
        <textarea 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)} 
          rows={4} 
          style={{ width: '100%' }}
          placeholder="Write your feedback here..."
        />
        <Button onClick={handleFeedbackSubmit} variant="contained" sx={{ marginTop: 1 }}>Submit Feedback</Button>
      </Box>
    </div>
  );
};

export default RecordedLecture;
