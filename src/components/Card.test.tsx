import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    image: 'test-image.jpg',
  };

  it('should render title and subtitle', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  it('should render without a subtitle if not provided', () => {
    render(<Card title="Only Title" />);
    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(
      screen.queryByText(defaultProps.subtitle),
    ).not.toBeInTheDocument();
  });

  it('should render an image when the image prop is provided', () => {
    render(<Card {...defaultProps} />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', defaultProps.image);
    expect(imageElement).toHaveAttribute('alt', defaultProps.title);
  });

  it('should render a placeholder when no image is provided', () => {
    render(<Card title="No Image Card" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('🎵')).toBeInTheDocument();
  });

  it('should have a square shape by default', () => {
    const { container } = render(<Card title="Shape Test" />);
    expect(container.firstChild).toHaveClass('card-square');
  });

  it('should have a round shape when specified', () => {
    const { container } = render(
      <Card title="Shape Test" shape="round" />,
    );
    expect(container.firstChild).toHaveClass('card-round');
  });
});
