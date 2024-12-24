import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const ScheduleSection = () => (
  <Card className="p-6 bg-white rounded-lg shadow-sm mb-6">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Today's Schedule
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="8:00 AM - Mathematics Lecture" />
        </ListItem>
        <ListItem>
          <ListItemText primary="10:00 AM - Chemistry Lab" />
        </ListItem>
        <ListItem>
          <ListItemText primary="1:00 PM - Biology Group Discussion" />
        </ListItem>
        <ListItem>
          <ListItemText primary="3:00 PM - Physics Study Session" />
        </ListItem>
        {/* Add more schedule items as needed */}
      </List>
    </CardContent>
  </Card>
);

export default ScheduleSection;
