const Simulation = require('../models/Simulation'); // Adjust the path as needed

// Create a new simulation
const createSimulation = async (req, res) => {
  try {
    const simulation = new Simulation(req.body);
    await simulation.save();
    res.status(201).send(simulation);
  } catch (err) {
    res.status(400).send({ message: 'Failed to create simulation', details: err.message });
  }
};

// Get a simulation by ID
const getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).send({ message: 'Simulation not found' });
    }
    res.send(simulation);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch simulation data', details: err.message });
  }
};

// Update a simulation by ID
const updateSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!simulation) {
      return res.status(404).send({ message: 'Simulation not found' });
    }
    res.send(simulation);
  } catch (err) {
    res.status(400).send({ message: 'Failed to update simulation', details: err.message });
  }
};

// Delete a simulation by ID
const deleteSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndDelete(req.params.id);
    if (!simulation) {
      return res.status(404).send({ message: 'Simulation not found' });
    }
    res.send({ message: 'Simulation deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete simulation', details: err.message });
  }
};

module.exports = {
  createSimulation,
  getSimulationById,
  updateSimulationById,
  deleteSimulationById
};
