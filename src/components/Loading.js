import { FaSpinner } from 'react-icons/fa';

const Loading = ({ message = 'Carregando...' }) => (
  <div className="loading-container">
    <FaSpinner className="spinner" size={32} />
    <p>{message}</p>
  </div>
);

export default Loading;
