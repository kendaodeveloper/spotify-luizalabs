import './Layout.css';

import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
