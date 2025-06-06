import './App.css';

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Artistas from './pages/Artistas';
import ArtistaDetalhes from './pages/ArtistaDetalhes';
import Playlists from './pages/Playlists';
import Perfil from './pages/Perfil';

function App() {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.hostname = '127.0.0.1'; // force not to use localhost
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/artistas" element={<Artistas />} />
            <Route path="/artistas/:artistId" element={<ArtistaDetalhes />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
