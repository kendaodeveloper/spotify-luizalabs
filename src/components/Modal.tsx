interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (
    _e,
  ) => {
    onClose();
  };

  const handleDialogClick: React.MouseEventHandler<HTMLDivElement> = (
    e,
  ) => {
    e.stopPropagation();
  };

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog" onClick={handleDialogClick}>
        <button className="dialog-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
