import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, MenuItem, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const PastPapers: React.FC = () => {
  const [institution, setInstitution] = useState<string | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [yearSemester, setYearSemester] = useState<string | null>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [previewPaper, setPreviewPaper] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data for institutions or other dropdowns
    // This could be an API call
  }, []);

  const fetchPapers = () => {
    // Simulate an API call to fetch papers based on selected filters
    const mockPapers = [
      { id: 1, title: 'Math 101 - Semester 1', preview: 'This is a math paper preview.' },
      { id: 2, title: 'Physics 202 - Semester 2', preview: 'This is a physics paper preview.' },
    ];
    setPapers(mockPapers);
  };

  const handlePreview = (paper: any) => {
    setPreviewPaper(paper.preview);
    setIsModalVisible(true);
  };

  const handleDownload = (paperId: number) => {
    // Trigger payment flow
    alert(`Initiating payment for paper ID: ${paperId}`);
  };

  return (
    <div className="past-papers">
      <h1>Past Papers</h1>
      <div className="filters">
        <Select
          value={institution || ""}
          onChange={(e) => setInstitution(e.target.value)}
          displayEmpty
          style={{ width: 200 }}
        >
          <MenuItem disabled value="">
            Choose Institution
          </MenuItem>
          <MenuItem value="Institution A">Institution A</MenuItem>
          <MenuItem value="Institution B">Institution B</MenuItem>
        </Select>
        <Select
          value={school || ""}
          onChange={(e) => setSchool(e.target.value)}
          displayEmpty
          style={{ width: 200 }}
        >
          <MenuItem disabled value="">
            Choose School
          </MenuItem>
          <MenuItem value="School of Engineering">School of Engineering</MenuItem>
          <MenuItem value="School of Arts">School of Arts</MenuItem>
        </Select>
        <Select
          value={department || ""}
          onChange={(e) => setDepartment(e.target.value)}
          displayEmpty
          style={{ width: 200 }}
        >
          <MenuItem disabled value="">
            Choose Department
          </MenuItem>
          <MenuItem value="Department of Physics">Department of Physics</MenuItem>
          <MenuItem value="Department of History">Department of History</MenuItem>
        </Select>
        <Select
          value={course || ""}
          onChange={(e) => setCourse(e.target.value)}
          displayEmpty
          style={{ width: 200 }}
        >
          <MenuItem disabled value="">
            Choose Course
          </MenuItem>
          <MenuItem value="Math 101">Math 101</MenuItem>
          <MenuItem value="History 201">History 201</MenuItem>
        </Select>
        <Select
          value={yearSemester || ""}
          onChange={(e) => setYearSemester(e.target.value)}
          displayEmpty
          style={{ width: 200 }}
        >
          <MenuItem disabled value="">
            Choose Year & Semester
          </MenuItem>
          <MenuItem value="2023 Semester 1">2023 Semester 1</MenuItem>
          <MenuItem value="2023 Semester 2">2023 Semester 2</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={fetchPapers}>Search</Button>
      </div>
      <div className="papers-list">
        {papers.map((paper) => (
          <Card key={paper.id} variant="outlined" style={{ margin: '10px 0', padding: '10px' }}>
            <h3>{paper.title}</h3>
            <p>{paper.preview.slice(0, 50)}...</p>
            <Button variant="text" onClick={() => handlePreview(paper)}>Preview</Button>
            <Button variant="contained" color="primary" onClick={() => handleDownload(paper.id)}>Pay & Download</Button>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        aria-labelledby="paper-preview-title"
        aria-describedby="paper-preview-description"
      >
        <div className="modal-content">
          <h2 id="paper-preview-title">Paper Preview</h2>
          <p id="paper-preview-description">{previewPaper}</p>
        </div>
      </Modal>
    </div>
  );
};

export default PastPapers;
