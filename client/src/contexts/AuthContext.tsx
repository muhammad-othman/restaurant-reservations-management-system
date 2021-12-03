import React, { createContext, useEffect, useState } from 'react';
import { IUser } from '../types';
import { clearAuthToken, setAuthToken } from '../utils/axiosConfig';



type AuthProviderProps = {
  currentUser?: IUser;
  setUserData: (data: { token: string, user: IUser }) => void;
  updateUserData: (user: IUser) => void;
  logout: () => void;
  authApplied: boolean;
};

const AuthContext = createContext<AuthProviderProps>(null as any);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [authApplied, setAuthApplied] = useState<boolean>();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData')) as IUser;
    const jwt = JSON.parse(localStorage.getItem('token'));
    if (!userData) {
      setAuthApplied(true);
      return null;
    }

    setAuthToken(jwt);
    setCurrentUser(userData);
    setAuthApplied(true);
  }, []);

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    clearAuthToken();
    setCurrentUser(null);
  };

  const setUserData = (data: { token: string, user: IUser }) => {
    localStorage.setItem('token', JSON.stringify(data.token));
    localStorage.setItem('userData', JSON.stringify(data.user));
    setAuthToken(data.token);
    setCurrentUser(data.user);
  };

  const updateUserData = (user: IUser) => {
    localStorage.setItem('userData', JSON.stringify(user));
    setCurrentUser(user);
  };



  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setUserData,
        logout,
        updateUserData,
        authApplied,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
