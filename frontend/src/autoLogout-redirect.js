import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/auth-hook';

const AutoLogoutRedirect = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user');
    }
  }, [isLoggedIn, navigate]);

  return null;
};

export default AutoLogoutRedirect;
