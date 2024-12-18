import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Interactive: React.FC = () => {
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/interactive-content');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/interactive-content/${id}`, selectedContent);
      console.log('Content updated:', response.data);
      fetchContent(); // Refresh content after update
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/interactive-content/${id}`);
      console.log('Content deleted');
      fetchContent(); // Refresh content after deletion
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleRate = async (id: string, rating: number) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/interactive-content/${id}/rate`, { rating });
      console.log('Content rated:', response.data);
      fetchContent(); // Refresh content after rating
    } catch (error) {
      console.error('Error rating content:', error);
    }
  };

  const handleClickOpen = (content: any) => {
    setSelectedContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContent(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedContent({ ...selectedContent, [name]: value });
  };

  const handleRedirect = (id: string) => {
    navigate(`/simulation/${id}`); // Redirect to simulation playground with ID
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Interactive Dashboard
      </Typography>
      <Grid container spacing={3}>
        {content.map((item: any) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{item.title}</Typography>
                <Typography>{item.description}</Typography>
                <Typography>{item.contentType}</Typography>
                <Typography>{item.difficultyLevel}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleClickOpen(item)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
                <Button size="small" color="primary" onClick={() => handleRate(item._id, 5)}>
                  Rate 5
                </Button>
                <Button size="small" color="primary" onClick={() => handleRedirect(item._id)}>
                  View
                </Button> {/* Add View button */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Content</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={selectedContent?.title || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={selectedContent?.description || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="contentType"
            label="Content Type"
            type="text"
            fullWidth
            value={selectedContent?.contentType || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="url"
            label="URL"
            type="text"
            fullWidth
            value={selectedContent?.url || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="learningModule"
            label="Learning Module"
            type="text"
            fullWidth
            value={selectedContent?.learningModule || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="createdBy"
            label="Created By"
            type="text"
            fullWidth
            value={selectedContent?.createdBy || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            value={selectedContent?.tags?.join(', ') || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            type="number"
            fullWidth
            value={selectedContent?.duration || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="difficultyLevel"
            label="Difficulty Level"
            type="text"
            fullWidth
            value={selectedContent?.difficultyLevel || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="learningObjectives"
            label="Learning Objectives"
            type="text"
            fullWidth
            value={selectedContent?.learningObjectives?.join(', ') || ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleUpdate(selectedContent._id)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Interactive;
