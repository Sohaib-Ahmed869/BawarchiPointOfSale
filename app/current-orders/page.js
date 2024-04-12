"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Modal from "react-bootstrap/Modal";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [GrandTotal, setGrandTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [change, setChange] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [id, setId] = useState("");
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1); // default quantity as 1

  const [itemPrice, setItemPrice] = useState(0); // default price as 0
  const [show, setShow] = useState(false);

  const [orderID, setOrderID] = useState("");

  const handleShowModal = (id, GrandTotal) => {
    setOrderID(id);
    setGrandTotal(GrandTotal);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddItem = () => {
    if (selectedItem === "") {
      alert("Please select an item");
      return;
    }
    addItem(id, selectedItem, quantity, itemPrice);

    //using backend find the existing grand total
    fetch(`${BACKEND}/cashier/orderPrice/${orderID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data", data);
        setGrandTotal(data);
        console.log("Grand Total", GrandTotal);
      })
      .catch((err) => {
        console.log(err);
      });

    // update in backend
    fetch(`${BACKEND}/cashier/orderPrice/${orderID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Grand_Total: GrandTotal,
        itemPrice: itemPrice,
        quantity: quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    setQuantity(1);
    setSelectedItem("");
    setItemPrice(0);

    handleCloseModal();
  };

  useEffect(() => {
    setChange(amountPaid - GrandTotal);
  }, [amountPaid, GrandTotal]);
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

  const getProducts = () => {
    fetch(`${BACKEND}/products/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log("Data", data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const showOrderModal = (id, GrandTotal) => {
    setOrderID(id);
    console.log("Order ID", id);
    handleShowModal(id, GrandTotal);
  };

  const addItem = (id, product_Name, qty, price) => {
    console.log(id);
    fetch(`${BACKEND}/cashier/order/additem/${orderID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: product_Name,
        quantity: qty,
        Price: price,
      }),
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

  const onChangeSelectedItem = (e) => {
    //split the value to get the price
    const [name, price] = e.target.value.split(" - Rs. ");
    setSelectedItem(name);
    setItemPrice(price);

    console.log("Selected Item", name);
    console.log("Price", price);
  };

  const handlePrint = () => {
    if (amountPaid < GrandTotal) {
      alert("Amount Paid is less than Grand Total");
      return;
    }
    console.log("Printing Receipt");
    console.log("Cart Items", cartItems);
    console.log("Customer Name", customerName);
    console.log("Grand Total", GrandTotal);
    console.log("Discount", discount);
    console.log("Payment Method", PaymentMethod);
    console.log("Change", change);
    console.log("Amount Paid", amountPaid);
    console.log("ID", id);

    printReceipt();
    fetch(`${BACKEND}/cashier/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Status: "Completed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Order Completed");
        getOrders();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const printReceipt = () => {
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

  const printReceipt2 = (customerName, cartItems, GrandTotal, discount, PaymentMethod) => {
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
      "<div style=' margin-top:30px'><strong>UNPAID</strong></div>";

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

  const getDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const getTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  const updateOrder = (
    id,
    status,
    customerName,
    cartItems,
    GrandTotal,
    discount,
    PaymentMethod
  ) => {
    if (status !== "Completed") {
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
    }

    if (status === "Completed") {
      setCartItems(cartItems);
      setCustomerName(customerName);
      setGrandTotal(GrandTotal);
      setDiscount(discount);
      setPaymentMethod(PaymentMethod);
      setId(id);

      setShow(true);
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
                    <p className="text-sm">
                      Created At: {getTime(order.Date)} {getDate(order.Date)}
                    </p>
                    <p className="text-lg">Total: {order.Total}</p>
                  </div>
                  <div className="flex items-left gap-2 text-white flex-col mt-4 text-left text-white">
                    <ul>
                      {order.Items.map((item, index) => (
                        <li key={index}>
                          {item.Name} x {item.quantity} - Rs. {item.Price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-4 mt-4 justify-between border-t border-gray-700 pt-4">
                    <p
                      className="text-white p-2 rounded-md border border-gray-700"
                      style={{
                        backgroundColor:
                          order.Payment_Method === "Cash"
                            ? "green"
                            : order.Payment_Method === "Card"
                            ? "blue"
                            : "orange",
                      }}
                    >
                      {order.Payment_Method}
                    </p>
                    <div>
                      <button 
                        className="bg-orange-500 text-white p-2 rounded-md mr-10"
                        onClick={() => {printReceipt2(order.Customer_Name, order.Items, order.Grand_Total, order.Discount, order.Payment_Method)}}
                      >
                        Print Receipt
                      </button>
                      <button
                        className="bg-orange-500 text-white p-2 rounded-md mr-10"
                        onClick={() =>
                          showOrderModal(order._id, order.Grand_Total)
                        }
                      >
                        Add Item
                      </button>
                      <select
                        className="bg-black text-white p-2 rounded-md border border-gray-700"
                        value={order.Status}
                        onChange={(e) =>
                          updateOrder(
                            order._id,
                            e.target.value,
                            order.Customer_Name,
                            order.Items,
                            order.Total,
                            order.Discount,
                            order.Payment_Method
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        {/* <option value="Cancelled">Cancelled</option>
                      <option value="Delivered">Delivered</option> */}
                      </select>
                    </div>
                  </div>
                </div>
              ) : null
            )}
        </div>

      </main>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="bg-gray-900 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Amount Paid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg">Grand Total: {GrandTotal}</p>
          <p className="text-lg">Change: {change}</p>
          <br />
          <input
            type="number"
            placeholder="Amount Paid"
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-between mt-5">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={() => setShow(false)}
          >
            Close
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShow(false);
              handlePrint();
            }}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="bg-gray-900 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Item to Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            value={`${selectedItem} - Rs. ${itemPrice}`}
            onChange={(e) => onChangeSelectedItem(e)}
            className="bg-black text-white p-2 rounded-md border border-gray-700"
          >
            <option value="">Select Item</option>
            {/* Map through your items array to render options */}
            {products.map((item) => (
              <option key={item.id} value={`${item.Name} - Rs. ${item.Price}`}>
                {item.Name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border border-gray-300 rounded-md text-black mt-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-between mt-5">
          <button onClick={handleCloseModal}>Cancel</button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
            onClick={() =>
              handleAddItem(orderID, selectedItem, quantity, selectedItem.Price)
            }
          >
            Add Item
          </button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default CurrentOrders;
