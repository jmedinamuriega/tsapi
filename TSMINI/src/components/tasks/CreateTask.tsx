import React from 'react';
import TaskForm from './TaskForm';
import { createTask } from '../../services/taskService';
import { Task } from '../../types/task';

const CreateTask: React.FC = () => {
  const handleTaskSubmit = async (task: Task) => {
    await createTask(task);
  };

  return <TaskForm onSubmit={handleTaskSubmit} />;
};

export default CreateTask;
