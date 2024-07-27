import axios from 'axios';
import { Task } from '../types/task';


const API_URL = 'http://localhost:5000';


const axiosInstance = axios.create({
  baseURL: API_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};


export const fetchTask = async (taskId: number): Promise<Task> => {
  const response = await axiosInstance.get(`/tasks/${taskId}`);
  return response.data;
};


export const createTask = async (task: Task): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
};


export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${task.id}`, task);
  return response.data;
};


export const deleteTask = async (taskId: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`);
};
