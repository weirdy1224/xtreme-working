import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const LogoutButton = ({ children, className = "btn btn-primary rounded-4xl" }) => {
  const { authUser, logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
  };

  if (!authUser) {
    return null;
  }

  return (
    <button className={className} onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
