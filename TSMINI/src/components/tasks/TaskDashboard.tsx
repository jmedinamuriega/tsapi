import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasks, deleteTask } from '../../services/taskService';
import { Task } from '../../types/task';
import './taskdash.css';

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchTasks();
      setTasks(result);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="task-dashboard">
      <h1>Task Dashboard</h1>
      <Link to="/tasks/new" className="create-task-link">Create New Task</Link>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDashboard;
