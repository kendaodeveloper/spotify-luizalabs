import React from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
