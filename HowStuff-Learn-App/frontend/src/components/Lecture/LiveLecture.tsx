// src/components/Lecture/LiveLecture.tsx
import { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

const LiveLecture = () => {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleQuestionSubmit = () => {
    console.log('Question submitted:', question);
    setQuestion('');
  };

  const handleChatMessageSubmit = (message: string) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div>
      <Typography variant="h4">Live Lecture: Introduction to Physics</Typography>
      <Box sx={{ width: '100%', height: 400, backgroundColor: '#ccc', marginBottom: 2 }}>
        <Typography variant="h6">Live Video Stream (Placeholder)</Typography>
      </Box>

      <Box>
        <Typography variant="h6">Ask a Question:</Typography>
        <TextField value={question} onChange={(e) => setQuestion(e.target.value)} label="Your Question" fullWidth />
        <Button onClick={handleQuestionSubmit} variant="contained" sx={{ marginTop: 1 }}>Submit Question</Button>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Live Chat:</Typography>
        {chatMessages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
        <TextField onBlur={(e) => handleChatMessageSubmit(e.target.value)} label="Enter your message" fullWidth />
      </Box>
    </div>
  );
};

export default LiveLecture;
