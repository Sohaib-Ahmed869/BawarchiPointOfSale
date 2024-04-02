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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateOrder = (id, status) => {
    fetch(`${BACKEND}/cashier/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Status: status }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        getOrders();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
        {
          //if orders which are not completed, cancelled or delivered are empty
          orders.filter(
            (order) =>
              order.Status !== "Completed" &&
              order.Status !== "Cancelled" &&
              order.Status !== "Delivered"
          ).length === 0 && (
            <div className="bg-black bg-opacity-50 p-4 rounded-md shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold">No Active Orders</h3>
            </div>
          )
        }
        <div className="flex flex-col gap-4">
          {orders &&
            orders.map((order) =>
              order.Status !== "Completed" &&
              order.Status !== "Cancelled" &&
              order.Status !== "Delivered" ? (
                
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
                    <select
                      className="bg-black text-white p-2 rounded-md border border-gray-700"
                      value={order.Status}
                      onChange={(e) => updateOrder(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ) : null
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
