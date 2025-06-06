const Profile = ({ user, onLogout }) => {
  if (!user) return <div className="profile-container">Carregando perfil...</div>;

  return (
    <header className="profile-container">
      <div style={{display: 'flex', alignItems: 'center'}}>
        {user.images && user.images.length > 0 && (
            <img src={user.images[0].url} alt={user.display_name} style={{width: 50, height: 50, borderRadius: '50%', marginRight: 15}}/>
        )}
        <h2>Bem-vindo, {user.display_name}</h2>
      </div>
      <button onClick={onLogout} className="logout-button">Sair</button>
    </header>
  );
};

export default Profile;
