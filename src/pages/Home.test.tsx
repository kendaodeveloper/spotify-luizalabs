import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('should render welcome message and information text', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: /Bem-vindo\(a\)!/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Explore seus artistas mais ouvidos/i),
    ).toBeInTheDocument();
  });
});
