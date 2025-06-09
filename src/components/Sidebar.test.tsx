import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import Sidebar from './Sidebar';

jest.mock('lucide-react', () => ({
  Home: () => <span data-testid="home-icon" />,
  DiscAlbum: () => <span data-testid="disc-icon" />,
  Play: () => <span data-testid="play-icon" />,
  User: () => <span data-testid="user-icon" />,
}));

jest.mock('./../assets/spotify.png', () => 'spotify-logo.png');

describe('Sidebar Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter });
  };

  it('should render the Spotify logo', () => {
    renderWithRouter(<Sidebar />);
    const logo = screen.getByRole('img', { name: /spotify/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'spotify-logo.png');
  });

  it('should render all navigation links with icons', () => {
    renderWithRouter(<Sidebar />);

    expect(
      screen.getByRole('link', { name: /home/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /artistas/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('disc-icon')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /playlists/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /perfil/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('should have correct href attributes for links', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      screen.getByRole('link', { name: /artistas/i }),
    ).toHaveAttribute('href', '/artists');
    expect(
      screen.getByRole('link', { name: /playlists/i }),
    ).toHaveAttribute('href', '/playlists');
    expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute(
      'href',
      '/profile',
    );
  });
});
