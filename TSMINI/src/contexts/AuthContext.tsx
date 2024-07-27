import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth';
import { loginService, logoutService, fetchUserFromDatabase } from '../services/authService';


const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => {
    throw new Error('Not implemented');
  },
  logout: async () => {
    throw new Error('Not implemented');
  },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
    console.log('Attempting to login with username:', username);
    try {
      const response = await loginService(username, password);
      console.log('Login response:', response);
  
      const { token, user: loggedInUser } = response;
  

      if (!token || !loggedInUser) {
        throw new Error('Invalid login response');
      }
  
      console.log('Login successful:', loggedInUser);
      setUser(loggedInUser);
      sessionStorage.setItem('accessToken', token);
      return { token, user: loggedInUser };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Failed to log in');
    }
  };


  const logout = async (): Promise<void> => {
    console.log('Attempting to log out');
    try {
      await logoutService();
      console.log('Logout successful');
      setUser(null);
      sessionStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  };


  useEffect(() => {
    const initializeUser = async () => {
      console.log('Initializing user from session storage');
      const storedToken = sessionStorage.getItem('accessToken');
      if (storedToken) {
        console.log('Token found:', storedToken);
        try {
          const fetchedUser = await fetchUserFromDatabase();
          if (fetchedUser) {
            console.log('User fetched successfully:', fetchedUser);
            setUser(fetchedUser);
          } else {
            console.log('No user found, removing token');
            sessionStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Failed to fetch user from database:', error);
          sessionStorage.removeItem('accessToken');
        }
      } else {
        console.log('No token found in session storage');
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
