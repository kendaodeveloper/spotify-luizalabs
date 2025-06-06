import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';

const Home = ({ token, onLogout }) => {
  return (
    <div className="home-layout">
      <Sidebar />
      <main className="main-content">
        <Profile token={token} onLogout={onLogout} />
      </main>
    </div>
  );
};

export default Home;
