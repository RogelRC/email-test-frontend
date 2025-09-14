import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  // Get the token from cookies
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  return {
    'Authorization': `Bearer ${cookieValue || ''}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
};

export default {
  async getEmails() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/emails`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  },

  async sendEmail(emailData) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/emails`, emailData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};
