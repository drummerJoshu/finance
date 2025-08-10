import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  enableTwoFactor: () => Promise<void>;
  enableBiometric: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('financehub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        twoFactorEnabled: false,
        biometricEnabled: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('financehub_user', JSON.stringify(mockUser));
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: 'user@gmail.com',
        name: 'John Doe',
        twoFactorEnabled: false,
        biometricEnabled: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('financehub_user', JSON.stringify(mockUser));
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        twoFactorEnabled: false,
        biometricEnabled: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('financehub_user', JSON.stringify(mockUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financehub_user');
    toast.success('Logged out successfully');
  };

  const enableTwoFactor = async () => {
    if (user) {
      const updatedUser = { ...user, twoFactorEnabled: true };
      setUser(updatedUser);
      localStorage.setItem('financehub_user', JSON.stringify(updatedUser));
      toast.success('Two-factor authentication enabled');
    }
  };

  const enableBiometric = async () => {
    if (user) {
      const updatedUser = { ...user, biometricEnabled: true };
      setUser(updatedUser);
      localStorage.setItem('financehub_user', JSON.stringify(updatedUser));
      toast.success('Biometric authentication enabled');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      enableTwoFactor,
      enableBiometric,
    }}>
      {children}
    </AuthContext.Provider>
  );
};