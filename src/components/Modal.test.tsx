import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal Component', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    handleClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    const overlay =
      screen.getByText('Modal Content').parentElement?.parentElement;
    expect(overlay).toHaveClass('dialog-overlay');

    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when the dialog content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div data-testid="dialog-content">Modal Content</div>
      </Modal>,
    );

    const dialogContent = screen.getByTestId('dialog-content');
    fireEvent.click(dialogContent);

    expect(handleClose).not.toHaveBeenCalled();
  });
});
