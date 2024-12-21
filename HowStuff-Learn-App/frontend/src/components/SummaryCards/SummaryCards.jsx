import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const SummaryCards = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Today's Plan</Typography>
            <Typography>Upcoming tasks, lectures, and deadlines.</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Progress Overview</Typography>
            <Typography>Visual representation of learning goals, completed modules, and badges earned.</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Quick Actions</Typography>
            <Button variant="contained" color="primary">Start a Lesson</Button>
            <Button variant="contained" color="primary">Continue Module</Button>
            <Button variant="contained" color="primary">Join Study Group</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h5">Notifications</Typography>
            <Typography>Alerts for new content, due assignments, or group activities.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
