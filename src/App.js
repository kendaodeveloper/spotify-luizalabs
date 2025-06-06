import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import './App.css';
import Callback from './pages/Callback';

const AppContent = () => {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.hostname = '127.0.0.1'; // force not to use localhost
    }
  }, []);

  const { token } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={token ? <Home /> : <Login />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route 
        path="/callback" 
        element={<Callback />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
