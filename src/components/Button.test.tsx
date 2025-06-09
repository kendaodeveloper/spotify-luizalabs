import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
  it('should render the button with its children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', {
      name: /click me/i,
    });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const buttonElement = screen.getByRole('button', {
      name: /click me/i,
    });
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the default and custom class names', () => {
    const customClass = 'my-custom-class';
    render(<Button className={customClass}>Styled Button</Button>);

    const buttonElement = screen.getByRole('button', {
      name: /styled button/i,
    });
    expect(buttonElement).toHaveClass('btn-primary');
    expect(buttonElement).toHaveClass(customClass);
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const buttonElement = screen.getByRole('button', {
      name: /disabled button/i,
    });
    expect(buttonElement).toBeDisabled();
  });
});
