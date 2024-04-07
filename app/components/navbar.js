"use client";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      setIsLogged(true);
      console.log("Logged In");
      console.log(token);
    }
    if (!token) {
      setIsLogged(false);
      console.log("Not Logged In");
    }
  }, [token, isLogged]);




  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-dark-800 text-white py-4 shadow-md bg-black border-b border-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Bawarchi Restaurant"
            className="w-20 h-26 object-contain"
          />
        </div>

        {isLogged ? (
          <div className="flex items-center gap-4">
            <a href="/" className="text-white">
              Home
            </a>
            <a href="/Menu" className="text-white">
              Menu
            </a>
            {/* <a href="/orders" className="text-white">
              Orders
            </a> */}
            <a href="/current-orders" className="text-white">
              Active Orders
            </a>
            <a href="/cancelled-orders" className="text-white">
              Cancelled Orders
            </a>
          </div>
        ) : null}

        <div className="flex items-center">
          {isLogged ? (
            <button
              onClick={onLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
