import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskPage from './pages/TaskPage';
import TaskDetails from './components/tasks/TaskDetails';
import CreateTask from './components/tasks/CreateTask';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import './components/tasks/taskmanagment.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<PrivateRoute element={<TaskPage />} />}>
            <Route path="new" element={<CreateTask />} />
            <Route path=":taskId" element={<TaskDetails />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
