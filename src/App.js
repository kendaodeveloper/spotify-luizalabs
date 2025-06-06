import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import './App.css';
import Callback from './pages/Callback';

const AppContent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('spotify_access_token');

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    navigate('/login');
  };
  
  const RedirectPath = () => {
    return token ? <Home token={token} onLogout={handleLogout} /> : <Login />;
  };

  return (
    <Routes>
      <Route path="/" element={<RedirectPath />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
