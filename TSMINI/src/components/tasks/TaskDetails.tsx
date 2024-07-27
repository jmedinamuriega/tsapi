import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTask, updateTask, deleteTask } from '../../services/taskService';
import { Task } from '../../types/task';
import TaskForm from './TaskForm';
import './taskdetails.css';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (taskId) {
        const id = Number(taskId);
        if (!isNaN(id)) {
          try {
            const result = await fetchTask(id);
            setTask(result);
          } catch (error) {
            console.error('Failed to fetch task:', error);
          }
        } else {
          console.error('Invalid taskId:', taskId);
        }
      } else {
        console.error('taskId is undefined');
      }
    };

    fetchData();
  }, [taskId]);

  const handleUpdate = async (updatedTask: Task) => {
    if (taskId) {
      const id = Number(taskId);
      if (!isNaN(id)) {
        try {
          const result = await updateTask(updatedTask);
          setTask(result);
        } catch (error) {
          console.error('Failed to update task:', error);
        }
      } else {
        console.error('Invalid taskId:', taskId);
      }
    }
  };

  const handleDelete = async () => {
    if (taskId) {
      const id = Number(taskId);
      if (!isNaN(id)) {
        try {
          await deleteTask(id);
          navigate('/tasks');  
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      } else {
        console.error('Invalid taskId:', taskId);
      }
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task Details</h1>
      <TaskForm task={task} onSubmit={handleUpdate} />
      <button onClick={handleDelete}>Delete Task</button>
    </div>
  );
};

export default TaskDetails;
