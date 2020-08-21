import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ href, children, exact, to, onClick, disabled, className, type = 'button' }) => {
  if (href) {
    return (
      <a
        className={`btn ${className}`}
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        exact={exact}
        className={`btn ${className}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
