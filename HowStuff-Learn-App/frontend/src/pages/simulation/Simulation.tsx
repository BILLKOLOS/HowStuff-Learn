import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Alert // Import Alert component for error messages
} from '@mui/material';
import '@/assets/styles/layout.css'; // Ensure this imports your CSS

const Simulation: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State for handling errors

  useEffect(() => {
    fetchSimulation();
  }, [id]);

  const fetchSimulation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interactive-content/${id}`);
      setSimulation(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching simulation:', error);
      setError('Failed to load simulation data.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="simulation-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="simulation-container">
        <Alert severity="error">{error}</Alert> {/* Display error message */}
      </Container>
    );
  }

  if (!simulation) {
    return (
      <Container className="simulation-container">
        <Alert severity="warning">No simulation data found.</Alert> {/* Handle case where simulation is null */}
      </Container>
    );
  }

  return (
    <Container className="simulation-container">
      <Typography variant="h4" className="simulation-title">
        {simulation.title}
      </Typography>
      <Typography variant="body1" className="simulation-description">
        {simulation.description}
      </Typography>
      <iframe src={simulation.url} className="simulation-iframe" title={simulation.title} />
    </Container>
  );
};

export default Simulation;
