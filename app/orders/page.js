  "use client"
  import React, { useState, useEffect } from "react";
  import Footer from "../components/footer";
  import Navbar from "../components/navbar";

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const CurrentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [refundQty, setRefundQty] = useState(0);
    const [filterDate, setFilterDate] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("2024");
    const [sortByDate, setSortByDate] = useState(true);

    const onRefundClick = (item, qty, order) => {
      const body = {
        Product_ID: item._id,
        Quantity: qty,
        Order_id: order._id,
      };

      fetch(`${BACKEND}/cashier/refund`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          getOrders();
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const getOrders = () => {
      fetch(`${BACKEND}/cashier/orders/`)
        .then((res) => res.json())
        .then((data) => {
          let filteredOrders = data.filter((order) => order.Status === "Completed");

          // Apply date filter
          if (filterDate) {
            filteredOrders = filteredOrders.filter((order) => order.Date.includes(filterDate));
          }

          // Apply month filter
          if (filterMonth) {
            filteredOrders = filteredOrders.filter((order) => {
              const orderMonth = new Date(order.Date).getMonth() + 1;
              return orderMonth.toString() === filterMonth;
            });
          }

          // Apply year filter
          if (filterYear) {
            filteredOrders = filteredOrders.filter((order) => {
              const orderYear = new Date(order.Date).getFullYear();
              return orderYear.toString() === filterYear;
            });
          }

          // Sort orders by date
          if (sortByDate) {
            filteredOrders.sort((a, b) => new Date(b.Date) - new Date(a.Date));
          }

          setOrders(filteredOrders);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      getOrders();
    }, [filterDate, filterMonth, filterYear, sortByDate]);

    const convertDateToDateString = (date) => {
      const newDate = new Date(date);
      return newDate.toLocaleString();
    };

    return (
      <div className="flex min-h-screen flex-col justify-between">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">All Orders</h2>
          <div className="flex gap-2 mb-4 items-center justify-end">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-black text-white"
            />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-black text-white "
            >
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Year"
              className="border border-gray-300 rounded-md px-3 py-2 bg-black text-white"

            />
            <label className="flex items-center gap-2 text-white rounded-md border border-gray-700 p-2 justify-end">
              <input
                type="checkbox"
                checked={sortByDate}
                onChange={(e) => setSortByDate(e.target.checked)}
                className="mr-2 bg-black text-white p-2 rounded-md border border-gray-700"
              />
              Sort by Date
            </label>
          </div>
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="bg-black bg-opacity-50 p-4 rounded-md shadow-md border border-gray-700">
                <h3 className="text-xl font-semibold">No Orders</h3>
              </div>
            ) : (
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
                          <div className="flex gap-4 md:w-1/2">
                            <input
                              placeholder="Enter Qty to Refund"
                              max={item.quantity}
                              min={0}
                              type="number"
                              className="bg-black text-white p-2 rounded-md border border-gray-700 w-full ml-4 text-center justify-left "
                              onChange={(e) => setRefundQty(e.target.value)}
                            />
                            <button
                              className="bg-orange-500 text-white px-4 py-2 rounded-md ml-4"
                              onClick={() =>
                                onRefundClick(item, refundQty, order)
                              }
                            >
                              Refund
                            </button>
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
              ))
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
