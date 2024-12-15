import { Link } from 'react-router-dom';

function Button({ children, variant = 'primary', href, onClick, type = 'button', ...props }) {
  const baseStyles = 'px-4 py-2 rounded-lg transition-colors';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50',
  };

  const className = `${baseStyles} ${variants[variant]} ${props.className || ''}`;

  if (href) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;