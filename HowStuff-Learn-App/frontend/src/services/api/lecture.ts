// src/utils/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Replace with your actual API endpoint

export const lecturerLogin = async (credentials: { email: string, password: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}/lecturer/login`, credentials);
      return response.data; // Assuming the API returns a data object with tokens or user details
    } catch (error) {
      console.error("Error logging in as lecturer:", error);
      throw error; // You can throw the error or return a custom message if necessary
    }
  };

// Function to fetch all lectures (live and pre-recorded)
export const fetchLectures = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/lectures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};

// Function to fetch details of a specific lecture by ID
export const fetchLectureDetails = async (lectureId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/lectures/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecture details:", error);
    throw error;
  }
};

// Function to submit a question during a live lecture
export const submitQuestion = async (lectureId: string, question: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/lectures/${lectureId}/questions`, { question });
    return response.data;
  } catch (error) {
    console.error("Error submitting question:", error);
    throw error;
  }
};

// Function to submit feedback for a recorded lecture
export const submitFeedback = async (lectureId: string, feedback: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/lectures/${lectureId}/feedback`, { feedback });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// Function to fetch live chat messages for a specific lecture
export const fetchLiveChat = async (lectureId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/lectures/${lectureId}/chat`);
    return response.data;
  } catch (error) {
    console.error("Error fetching live chat:", error);
    throw error;
  }
};

// Function to submit a chat message during a live lecture
export const submitChatMessage = async (lectureId: string, message: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/lectures/${lectureId}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error submitting chat message:", error);
    throw error;
  }
};

// Function to fetch poll results for a live lecture
export const fetchPollResults = async (lectureId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/lectures/${lectureId}/poll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poll results:", error);
    throw error;
  }
};

// Function to submit a poll vote during a live lecture
export const submitPollVote = async (lectureId: string, option: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/lectures/${lectureId}/poll/vote`, { option });
    return response.data;
  } catch (error) {
    console.error("Error submitting poll vote:", error);
    throw error;
  }
};
