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
  Rating,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Interactive: React.FC = () => {
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
    fetchTags();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/interactive-content');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/interactive-content/${id}`, selectedContent);
      console.log('Content updated:', response.data);
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/interactive-content/${id}`);
      console.log('Content deleted');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleRate = async (id: string, rating: number) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/interactive-content/${id}/rate`, { rating });
      console.log('Content rated:', response.data);
      fetchContent();
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
    navigate(`/simulation/${id}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTagChange = (_event: any, newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const filteredContent = content.filter((item: any) => {
    const matchesSearchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.every(tag => item.tags.includes(tag));
    return matchesSearchQuery && matchesTags;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Interactive Dashboard
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      <Autocomplete
        multiple
        options={tags}
        getOptionLabel={(option: string) => option}
        value={selectedTags}
        onChange={(event: any, newValue: string[]) => handleTagChange(event, newValue)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Filter by tags" placeholder="Tags" />
        )}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
      />
      <Grid container spacing={3}>
        {filteredContent.map((item: any) => (
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
                <Rating
                  name={`rating-${item._id}`}
                  value={item.rating || 0}
                  onChange={(_event, newValue) => handleRate(item._id, newValue || 0)}
                />
                <Button size="small" color="primary" onClick={() => handleRedirect(item._id)}>
                  View
                </Button>
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
