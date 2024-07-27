import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../../services/authService';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      await registerService(username, password);
      navigate('/login'); // Redirect to login page after registration
    } catch (err) {
      console.error('Registration failed:', err); // Debugging log
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
