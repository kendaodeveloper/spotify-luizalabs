const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Logo</div>
      <nav>
        <ul>
          <li className="active">Início</li>
          <li>Buscar</li>
          <li>Sua Biblioteca</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
