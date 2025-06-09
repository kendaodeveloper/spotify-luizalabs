import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from './Loading';

jest.mock('lucide-react', () => ({
  LoaderCircle: () => <div data-testid="spinner-icon" />,
}));

describe('Loading Component', () => {
  it('should render with the default message', () => {
    render(<Loading />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
  });

  it('should render with a custom message', () => {
    const customMessage = 'Please wait...';
    render(<Loading message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
  });
});
