"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [password, setPassword] = useState("");
  const [realPassword, setRealPassword] = useState("1234");

  const [refundQty, setRefundQty] = useState(0);

  const getOrders = () => {
    fetch(`${BACKEND}/cashier/orders/`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        console.log("Data", data);
        //only show completed orders
        setOrders(data.filter((order) => order.Status === "Cancelled"));
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
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = newDate.getDate().toString().padStart(2, "0");
    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");

    // Construct the formatted date string
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return dateString;
  };

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Cancelled Orders</h2>
        <div className="flex flex-col gap-4">
          {orders &&
            orders.map((order) => (
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
                <div className="flex items-left gap-2 text-white flex-col mt-4 text-left border-t border-gray-700 pt-4 ">
                  <ul className="flex flex-col gap-4 justify-between w-full">
                    {order.Items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <div className="flex gap-4 md:w-1/2">
                          {item.Name} x {item.quantity}
                        </div>
                        
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4 mt-4 justify-end border-t border-gray-700 pt-4">
                  <p className="bg-black text-white p-2 rounded-md border border-gray-700">
                    {convertDateToDateString(order.Date)}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="fixed bottom-2 right-4">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
            onClick={getOrders}
          >
            Refresh
          </button>
        </div>
        {/* <div className="absolute bottom-0 top-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl text-black font-semibold">Enter your password to confirm the refund</h2>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-gray-200 text-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => {
                if (password === realPassword) {
                  console.log("Password Matched");
                } else {
                  console.log("Password Mismatch");
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div> */}
      </main>
      <Footer />
    </div>
  );
};

export default CurrentOrders;
