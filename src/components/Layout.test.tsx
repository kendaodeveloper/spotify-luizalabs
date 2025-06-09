import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./Sidebar', () => {
  const MockSidebar = () => <div data-testid="sidebar">Sidebar</div>;
  MockSidebar.displayName = 'MockSidebar';
  return MockSidebar;
});

const OutletTestComponent = () => (
  <div data-testid="outlet-content">Outlet Page</div>
);

describe('Layout Component', () => {
  const useAuthMock = useAuth as jest.Mock;

  it('should render Sidebar and Outlet when user is authenticated', () => {
    useAuthMock.mockReturnValue({ token: 'fake-token' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OutletTestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('should redirect to /login when user is not authenticated', () => {
    useAuthMock.mockReturnValue({ token: null });

    const LoginPage = () => <div>Login Page</div>;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
