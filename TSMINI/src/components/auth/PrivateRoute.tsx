import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

 
  if (loading) {
    return <div>Loading...</div>;
  }


  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
