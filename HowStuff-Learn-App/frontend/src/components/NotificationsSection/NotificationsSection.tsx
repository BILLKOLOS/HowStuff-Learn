import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const NotificationsSection = () => (
  <Card className="p-6 bg-white rounded-lg shadow-sm mb-6">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="New content available in Biology course" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Assignment due tomorrow in Chemistry" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Join the Physics study group meeting at 4 PM" />
        </ListItem>
        {/* Add more notifications as needed */}
      </List>
    </CardContent>
  </Card>
);

export default NotificationsSection;
