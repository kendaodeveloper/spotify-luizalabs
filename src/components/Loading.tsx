import './Loading.css';

import { LoaderCircle } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
}) => (
  <div className="loading-container">
    <LoaderCircle className="spinner" size={32} />
    <p>{message}</p>
  </div>
);

export default Loading;
