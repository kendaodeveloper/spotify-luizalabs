const Button = ({ onClick, children, className = '', ...props }) => {
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
