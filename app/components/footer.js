import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-800 text-white text-center py-4" style={{ backgroundImage: "linear-gradient(to right, #000000, #333333)" }}>
      Copyright &copy; {new Date().getFullYear()} Bawarchi.PK powered by Hexler Tech
    </footer>
  );
};

export default Footer;
    