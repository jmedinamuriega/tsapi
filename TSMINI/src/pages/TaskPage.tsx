import React from 'react';
import { Outlet } from 'react-router-dom';
import CreateTask from '../components/tasks/CreateTask';
import TaskDashboard from '../components/tasks/TaskDashboard';

const TaskPage: React.FC = () => {
  return (
    <div>
      <h1>Task Management</h1>
      <CreateTask />
      <TaskDashboard />
      <Outlet />
    </div>
  );
};

export default TaskPage;
