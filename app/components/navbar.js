"use client"
import React, { useState, useEffect } from "react"

const Navbar = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        if (token) {
            setIsLogged(true);
            console.log('Logged In');
        }
    }, [token, isLogged]);


    return (
        <nav className="bg-dark-800 text-white py-4 shadow-md bg-black border-b border-gray-900">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Bawarchi Restaurant" className="w-20 h-26 object-contain" />
                </div>

            </div>

        </nav>
    )

}

export default Navbar;