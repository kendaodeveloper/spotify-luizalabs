import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/artists">Artistas</NavLink></li>
          <li><NavLink to="/playlists">Playlists</NavLink></li>
          <li><NavLink to="/profile">Perfil</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
