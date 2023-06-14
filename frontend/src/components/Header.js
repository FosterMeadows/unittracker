import React from 'react';
import '../styles/Header.css';
import logo from '../assets/cc2.svg'; // replace with the path to your logo file

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" /> {/* Add the logo here */}
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/#">Class Information</a></li>
        <li><a href="/#">About</a></li>
      </ul>
    </div>
  );
};

export default Header;
