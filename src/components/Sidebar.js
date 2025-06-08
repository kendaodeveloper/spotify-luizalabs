import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaPlay, FaCompactDisc } from 'react-icons/fa';
import SpotifyImage from '../assets/spotify.png';

const Sidebar = () => {
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
              <FaHome size={iconSize} className="sidebar-icon" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/artists">
              <FaCompactDisc size={iconSize} className="sidebar-icon" />
              Artistas
            </NavLink>
          </li>
          <li>
            <NavLink to="/playlists">
              <FaPlay size={iconSize} className="sidebar-icon" />
              Playlists
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <FaUser size={iconSize} className="sidebar-icon" />
              Perfil
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
