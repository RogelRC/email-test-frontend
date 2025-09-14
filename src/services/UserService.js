import axios from 'axios';

const getCurrentUserId = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
    
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT Payload:', payload); // Debug log
    // Return the user ID from the token
    return payload.user_id || payload.sub || null;
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

const getAuthHeaders = () => {
  const getToken = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));
    return cookie ? cookie.split('=')[1] : null;
  };

  const token = getToken();
  if (!token) {
    console.error('No auth token found');
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const UserService = {
  async getUsers() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        userData,
        {
          headers: getAuthHeaders(),
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      // Re-throw the error with the response data if available
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        userData,
        {
          headers: getAuthHeaders(),
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      // Re-throw the error with the response data if available
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get current user ID from token
  getCurrentUserId,
  
  async getUser(id) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }
};

export default UserService;
