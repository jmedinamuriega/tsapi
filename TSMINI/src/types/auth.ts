
export interface User {
    id: number;
    username: string;
 
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
    password?: string; 
  }
  

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<{ token: string; user: User }>;
    logout: () => Promise<void>;
  }
  