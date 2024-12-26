import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Get the paperId from your backend or via session data
      const paperId = 'some-paper-id'; // Replace with actual paperId
      axios.get(`http://localhost:5000/paper/download/${paperId}`)
        .then((response) => {
          // Handle the response for downloading the file
        })
        .catch((error) => {
          console.error('Error downloading paper:', error);
        });
    }
  }, [sessionId]);

  return <div>Payment Successful! Your download will begin shortly.</div>;
};

export default Success;
