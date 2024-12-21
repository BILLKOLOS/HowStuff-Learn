import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

const QuickActionsSection = () => (
  <Card className="p-6 bg-white rounded-lg shadow-sm mb-6">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Button variant="contained" color="primary" fullWidth style={{ marginBottom: '8px' }}>
        Start a Lesson
      </Button>
      <Button variant="contained" color="primary" fullWidth style={{ marginBottom: '8px' }}>
        Continue Module
      </Button>
      <Button variant="contained" color="primary" fullWidth>
        Join Study Group
      </Button>
    </CardContent>
  </Card>
);

export default QuickActionsSection;
