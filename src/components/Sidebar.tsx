import { NavLink } from 'react-router-dom';
import { Home, DiscAlbum, Play, User } from 'lucide-react';
import SpotifyImage from './../assets/spotify.png';

const Sidebar: React.FC = () => {
  const iconSize = 25;

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <img
            src={SpotifyImage}
            alt="Spotify"
            className="spotify-sidebar"
          />
          <li>
            <NavLink to="/" end>
              <Home size={iconSize} className="sidebar-icon" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/artists">
              <DiscAlbum size={iconSize} className="sidebar-icon" />
              Artistas
            </NavLink>
          </li>
          <li>
            <NavLink to="/playlists">
              <Play size={iconSize} className="sidebar-icon" />
              Playlists
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <User size={iconSize} className="sidebar-icon" />
              Perfil
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
