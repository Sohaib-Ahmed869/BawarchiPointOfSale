"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-center mt-9 text-white uppercase">
          Welcome to Bawarchi Restaurant
        </h1>
        <p className="text-white text-center">
          This is the administration panel
        </p>

        <img
          src="/logo.png"
          alt="Bawarchi Restaurant"
          className="w-1/2 h-auto object-contain rounded-md"
        />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
