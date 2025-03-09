
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="mr-4 flex items-center font-semibold">
      <img src="/logo.svg" alt="VetJobBoard" className="h-8 w-8 mr-2" />
      <span className="text-xl">VetJobBoard</span>
    </Link>
  );
};

export default Logo;
