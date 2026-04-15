import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';

export default function useRouteHandlers() {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    if (typeof clearUser === 'function') clearUser();
    navigate('/login');
  }, [clearUser, navigate]);

  const handleClick = useCallback(
    (route) => {
      if (route === '/logout') {
        handleLogout();
        return;
      }
      navigate(`/${route}`);
    },
    [navigate, handleLogout]
  );

  return { user, handleClick, handleLogout };
}