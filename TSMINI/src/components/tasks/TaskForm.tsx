import React, { useState } from 'react';
import { createTask, updateTask } from '../../services/taskService';
import { Task } from '../../types/task';
import './taskform.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [dueDate, setDueDate] = useState(task ? task.due_date : '');
  const [status, setStatus] = useState(task ? task.status : 'pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      due_date: dueDate,
      status,
    } as Task;

    if (task && task.id !== undefined) {
      newTask.id = task.id;
      await updateTask(newTask);
    } else {
      await createTask(newTask);
    }

    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Title" 
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Description" 
      />
      <input 
        type="date" 
        value={dueDate} 
        onChange={(e) => setDueDate(e.target.value)} 
        placeholder="Due Date" 
      />
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default TaskForm;
