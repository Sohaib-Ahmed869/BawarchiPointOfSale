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

  const printReceipt = (cartItems, GrandTotal, discount, PaymentMethod, customerName) => {
    // Constructing receipt content
    let receiptContent = "";
    receiptContent +=
      "<div style='text-align:center; margin:auto; width: 100%; padding: 0px;'>";
    receiptContent +=
      "<div style='margin-bottom: 10px;'><img src='logo.png' alt='Logo' style='width:100px;'></div>"; // Replace 'logo.png' with the path to your logo
    receiptContent +=
      "<div><strong>---------- Receipt ----------</strong></div>";
    receiptContent +=
      "<div style=' margin-top:30px, font-weight:bold'>Shop#01, Ground Floor, Phantom Mall, I-8 Markaz, Islamabad</div>";
    receiptContent +=
      "<div style=' margin-top:10px, font-weight:bold'>051 2719280</div>";
    receiptContent +=
      "<div style=' margin-top:10px, font-weight:bold'>NTN Number: C251459-8</div>";
    receiptContent +=
      "<div style=' margin-top:30px'>Customer: " + customerName + "</div>";
    receiptContent +=
      "<div style=' margin-top:30px'>Date: " +
      new Date().toLocaleString() +
      "</div>";
    receiptContent +=
      "<div style='border:2px black solid; width:100%; align-self:center;  margin-top:30px'></div>";
    receiptContent +=
      "<div style=' margin-top:30px'><strong>PAID</strong></div>";

    // Table for displaying items
    receiptContent += "<table style='width: 100%; border-collapse: collapse;'>";
    receiptContent +=
      "<thead><tr><th style='border: 1px solid #000; padding: 8px;'>Item</th><th style='border: 1px solid #000; padding: 8px;'>Quantity</th><th style='border: 1px solid #000; padding: 8px;'>Price</th></tr></thead>";
    receiptContent += "<tbody>";
    cartItems.forEach((item) => {
      receiptContent += "<tr>";
      receiptContent +=
        "<td style='border: 1px solid #000; padding: 8px;'>" +
        item.Name +
        "</td>";
      receiptContent +=
        "<td style='border: 1px solid #000; padding: 8px;'>" +
        item.quantity +
        "</td>";
      receiptContent +=
        "<td style='border: 1px solid #000; padding: 8px;'>Rs." +
        item.Price * item.quantity +
        "</td>";
      receiptContent += "</tr>";
    });
    receiptContent += "</tbody></table>";

    receiptContent += "<div style='width: 100%;text-align:center;'>";
    receiptContent +=
      "<div style='border:2px black solid; width:100%; align-self:center;margin-top:10px;'></div>";
    receiptContent +=
      "<div style='margin-top:10px'><strong>Total: PKR" +
      GrandTotal +
      "</strong></div>";
    receiptContent +=
      "<div style='margin-top:10px'><strong>Discount: " +
      discount +
      "%</strong></div>";
    
    receiptContent +=
      "<div style='border:2px black solid; width:100%; align-self:center;margin-top:10px;'></div>";
    receiptContent +=
      "<div style='margin-top:10px'><strong>Payment Method: " +
      PaymentMethod +
      "</strong></div>";
    receiptContent +=
      "<div style='border:2px black solid; width:100%; align-self:center;margin-top:10px;'></div>";
    receiptContent +=
      "<div style='margin-top:10px; margin-bottom:20px'><strong>Thank you for your purchase!</strong></div>";
    receiptContent += "</div>";
    receiptContent += "</div>";

    // Opening a new window to display the receipt content
    const printWindow = window.open("", "_blank");

    // Writing the receipt content to the new window
    printWindow.document.write(
      "<div style='font-family: Arial, sans-serif;'>" +
        receiptContent +
        "</div>"
    );

    // Closing the document for printing
    printWindow.document.close();

    // Triggering printing
    printWindow.print();
  };

  const updateOrder = (id, status, customerName, cartItems, GrandTotal, discount, PaymentMethod) => {
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

    if (status === "Completed") {
      printReceipt(cartItems, GrandTotal, discount, PaymentMethod, customerName);
    }

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
                      onChange={(e) => updateOrder(order._id, e.target.value, order.Customer_Name, order.Items, order.Total, order.Discount, order.PaymentMethod)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      {/* <option value="Cancelled">Cancelled</option>
                      <option value="Delivered">Delivered</option> */}
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
