// controllers/pastPaperController.js

const PastPaper = require('../models/Papers');

// Fetch papers with pagination, filters, and sorting
const fetchPapers = async (req, res) => {
  try {
    const { institution, school, department, course, yearSemester, page = 1, limit = 10, sort = 'yearSemester' } = req.query;

    const filters = {};

    // Apply filters based on the query params
    if (institution) filters.institution = institution;
    if (school) filters.school = school;
    if (department) filters.department = department;
    if (course) filters.course = course;
    if (yearSemester) filters.yearSemester = yearSemester;

    // Apply sorting based on the query params
    const sortOptions = {};
    sortOptions[sort] = 1; // 1 for ascending, -1 for descending

    // Pagination logic
    const papers = await PastPaper.find(filters)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await PastPaper.countDocuments(filters); // Get total number of papers for pagination info

    // If no papers are found
    if (papers.length === 0) {
      return res.status(404).json({ message: 'No papers found' });
    }

    // Return papers with pagination info
    res.status(200).json({
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      papers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new past paper
const createPaper = async (req, res) => {
  try {
    // Validate the input data (e.g., check if required fields are present)
    const { institution, school, department, course, yearSemester, title, preview, file } = req.body;

    if (!institution || !school || !department || !course || !yearSemester || !title || !preview || !file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPaper = new PastPaper(req.body);
    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete a paper
const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await PastPaper.findById(id);

    if (!paper) {
      return res.status(404).json({ message: 'Past paper not found' });
    }

    paper.deleted = true;
    await paper.save();

    res.status(200).json({ message: 'Past paper deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search papers by title or preview text (full-text search)
const searchPapers = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const papers = await PastPaper.find({ $text: { $search: query } })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await PastPaper.countDocuments({ $text: { $search: query } });

    res.status(200).json({
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      papers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { fetchPapers, createPaper, deletePaper, searchPapers };
