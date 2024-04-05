"use client"
import React, { useState, useEffect } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const Login = () => {
    const [cashierName, setCashierName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(BACKEND)
        fetch(`${BACKEND}/cashier/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name:cashierName, Password:password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == '200') {
                    localStorage.setItem('token', data.token);
                    alert("Login Successful!");
                    window.location.href = '/';
                    // router.push('/dashboard');
                } else {

                    alert("Invalid Credentials! Please try again.");
                    console.log(data);
                }
            })
            .catch(err => {
                console.log(err.message);

            });
    }
 
    
    return (
        <div className="bg-black text-white flex min-h-screen flex-col justify-between">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <div className="w-full md:w-1/2 flex justify-center items-center">

                        <img src="/logo.png" alt="Registration" className="w-full h-auto object-contain" />
                    </div>

                    <div className="w-full md:w-1/2 px-4 py-6  rounded-md shadow-md bg-black bg-opacity-50 border border-gray-700 rounded p-4 h-96 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-4"
                        style={{color: "#de6107"}}
                        >Cashier Login</h2>
                        <form onSubmit={handleSubmit} >


                            <div className="mb-4">

                                <label htmlFor="cashierName" className="block text-gray-300 text-sm font-semibold mb-2">Cashier Name</label>

                                <input type="text" id="cashierName" name="cashierName" value={cashierName} onChange={(e) => setCashierName(e.target.value)} className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:border-orange-500" />

                            </div>

                            <div className="mb-4">

                                <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">Password</label>

                                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:border-orange-500" />

                            </div>

                            <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Login</button>

                        </form>

                    </div>

                </div>

            </main>

            <Footer />

        </div>

    )

}

export default Login;
    