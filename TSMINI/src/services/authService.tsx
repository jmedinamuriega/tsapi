import axios from 'axios';
import { User } from '../types/auth';

const API_URL = 'http://localhost:5000';


export const fetchUserFromDatabase = async (): Promise<User | null> => {
  try {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axios.get<User>(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user from database:', error);
    return null;
  }
};


export const registerService = async (username: string, password: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/register`, { username, password });
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed. Please try again.');
  }
};


// Update this function to return both token and user
export const loginService = async (username: string, password: string) => {
  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user, 
  };
};


// Log out the current user
export const logoutService = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/logout`);
    sessionStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed. Please try again.');
  }
};
