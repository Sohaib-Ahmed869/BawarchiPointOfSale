"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    fetch(`${BACKEND}/cashier/orders/`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        console.log("Data", data);
        //only show completed orders
        setOrders(data.filter((order) => order.Status === "Completed"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

    useEffect(() => {
        getOrders();
    }, []);

    const convertDateToDateString = (date) => {
        // Create a new Date object from the provided date string
        const newDate = new Date(date);
    
        // Get the individual date components
        const year = newDate.getFullYear();
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = newDate.getDate().toString().padStart(2, '0');
        const hours = newDate.getHours().toString().padStart(2, '0');
        const minutes = newDate.getMinutes().toString().padStart(2, '0');
        const seconds = newDate.getSeconds().toString().padStart(2, '0');
    
        // Construct the formatted date string
        const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
        return dateString;
    };
    

    return (
        <div className="flex min-h-screen flex-col justify-between">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
            <div className="flex flex-col gap-4">
              {orders &&
                orders.map((order) =>
                    <div
                      key={order._id}
                      className="bg-black bg-opacity-50 p-4 rounded-md shadow-md border border-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          Order ID: {order._id}
                        </h3>
                        <p className="text-lg">
                          Customer Name: {order.Customer_Name}
                        </p>
                        <p className="text-lg">Total: {order.Total}</p>
                      </div>
                      <div className="flex items-left gap-2 text-white flex-col mt-4 text-left">
                        <ul>
                          {order.Items.map((item, index) => (
                            <li key={index}>
                              {item.Name} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-4 mt-4 justify-end border-t border-gray-700 pt-4">
                        <p
                          className="bg-black text-white p-2 rounded-md border border-gray-700"
                        >
                          {convertDateToDateString(order.Date)}
                        </p>
                      </div>
                    </div>
                )}
            </div>
            <div className="fixed bottom-2 right-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md"
                onClick={getOrders}
              >
                Refresh
              </button>
            </div>
          </main>
          <Footer />
        </div>
      );
    };
    
    export default CurrentOrders;
    

