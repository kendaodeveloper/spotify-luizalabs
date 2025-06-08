import { FaSpinner } from 'react-icons/fa';

const Loading = ({ message = 'Carregando...' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2rem',
    }}
  >
    <FaSpinner className="spinner" size={32} />
    <p>{message}</p>
  </div>
);

export default Loading;
