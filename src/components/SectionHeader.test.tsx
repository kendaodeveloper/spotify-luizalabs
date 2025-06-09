import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionHeader from './SectionHeader';

describe('SectionHeader Component', () => {
  it('should render the title correctly', () => {
    const title = 'My Awesome Section';
    render(<SectionHeader title={title} />);

    const titleElement = screen.getByRole('heading', {
      name: title,
      level: 2,
    });
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the subtitle when provided', () => {
    const title = 'My Awesome Section';
    const subtitle = 'A great subtitle for the section';
    render(<SectionHeader title={title} subtitle={subtitle} />);

    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('should not render the subtitle element when not provided', () => {
    render(<SectionHeader title="Only a Title" />);

    const subtitleElement = screen.queryByText(/./, { selector: 'p' });
    expect(subtitleElement).not.toBeInTheDocument();
  });
});
