"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const MainScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [GST, setGST] = useState(0);
  const [GrandTotal, setGrandTotal] = useState(0);
  const [Status, setStatus] = useState("Pending");
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [PaymentDone, setPaymentDone] = useState(false);

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getProducts = () => {
    fetch(`${BACKEND}/admin/product/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        console.log("Data", data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getCatergories = () => {
    fetch(`${BACKEND}/cashier/categories/`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        console.log("Data", data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCatergories();
  }, []);

  const onCheckout = () => {
    const order = {
      Customer_Name: customerName,
      Items: cartItems,
      Total: total,
      GST: GST,
      Grand_Total: GrandTotal,
      Status: Status,
      Payment_Method: PaymentMethod,
      Payment_Done: PaymentDone,
      Date: new Date().toISOString(),
      Refunded_Items: [],
    };

    fetch(`${BACKEND}/cashier/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "200") {
          console.log(data);
          alert("Order Placed Successfully!");
        }
        setCartItems([]);
        setTotal(0);
        setCustomerName("");
        setGST(0);
        setGrandTotal(0);
        setStatus("Pending");
        setPaymentMethod("Cash");
        setPaymentDone(false);
      })
      .catch((err) => {
        alert("Error Placing Order! Please try again.");
        console.log(err);
      });
  };

  const addToCart = (product) => {
    const productIndex = cartItems.findIndex(
      (item) => item.Name === product.Name
    );
    if (productIndex === -1) {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    } else {
      const newCartItems = [...cartItems];
      newCartItems[productIndex].quantity += 1;
      setCartItems(newCartItems);
    }
    setTotal(total + product.Price);
  };

  const addQuantity = (product) => {
    const productIndex = cartItems.findIndex(
      (item) => item.Name === product.Name
    );
    const newCartItems = [...cartItems];
    newCartItems[productIndex].quantity += 1;
    setCartItems(newCartItems);
    setTotal(total + product.Price);
  };

  const removeQuantity = (product) => {
    const productIndex = cartItems.findIndex(
      (item) => item.Name === product.Name
    );
    const newCartItems = [...cartItems];
    if (newCartItems[productIndex].quantity === 1) {
      newCartItems.splice(productIndex, 1);
    } else {
      newCartItems[productIndex].quantity -= 1;
    }
    setCartItems(newCartItems);
    setTotal(total - product.Price);
  };

  const removeFromCart = (product) => {
    const productIndex = cartItems.findIndex(
      (item) => item.Name === product.Name
    );
    const newCartItems = [...cartItems];
    newCartItems.splice(productIndex, 1);
    setCartItems(newCartItems);
    setTotal(total - product.Price * product.quantity);
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
      total +
      "</strong></div>";
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

  return (
    <div className="bg-black text-white flex flex-col min-h-screen justify-between">
      <Navbar />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-8 md:w-3/4 right-0 bg-black p-4 shadow-md rounded-md border border-gray-900">
          {selectedCategory === "All" ? (
            <div
              className="bg-black p-4 shadow-md rounded-md border border-gray-900 bg-orange-500 cursor-pointer"
              onClick={() => onCategoryChange("All")}
            >
              <h2 className="text-xl font-semibold">All</h2>
            </div>
          ) : (
            <div
              className="bg-black p-4 shadow-md rounded-md border border-gray-900 hover:bg-orange-500 cursor-pointer"
              onClick={() => onCategoryChange("All")}
            >
              <h2 className="text-xl font-semibold">All</h2>
            </div>
          )}
          {categories &&
            categories.map((category, index) =>
              category.Name === selectedCategory ? (
                <div
                  key={index}
                  className="bg-black p-4 shadow-md rounded-md border border-gray-900 bg-orange-500 cursor-pointer"
                  onClick={() => onCategoryChange(category.Name)}
                >
                  <h2 className="text-xl font-semibold">{category.Name}</h2>
                </div>
              ) : (
                <div
                  key={index}
                  className="bg-black p-4 shadow-md rounded-md border border-gray-900 hover:bg-orange-500 cursor-pointer"
                  onClick={() => onCategoryChange(category.Name)}
                >
                  <h2 className="text-xl font-semibold">{category.Name}</h2>
                </div>
              )
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 md:w-3/4">
          {products.map((product, index) =>
            selectedCategory === "All" ||
            product.Category === selectedCategory ? (
              <div
                key={index}
                className="bg-black p-4 shadow-md rounded-md border border-gray-900"
              >
                <div className="flex justify-between items-center">
                  <img
                    src={`https://firebasestorage.googleapis.com/v0/b/bawarchi-61209.appspot.com/o/${product.Name}?alt=media&token=${product.token}`}
                    alt={product.Name}
                    className="w-16 h-16 object-cover rounded-md shadow-md"
                  />
                  <div className="flex flex-col items-right gap-2 text-right">
                    <h2 className="text-xl font-semibold">{product.Name}</h2>
                    <h3 className="text-sm font-semibold text-gray-300">
                      Rs {product.Price}
                    </h3>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-orange-500"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute right-0 top-0 bg-black p-4 shadow-md rounded-md border border-gray-900 h-full w-1/4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 overflow-y-auto">
            <h2 className="text-2xl font-semibold">Cart</h2>
            <div className="bottom-0 bg-black p-4 mb-2 shadow-md rounded-md border border-gray-900">
              <h2 className="text-xl font-semibold">Total: Rs {total}</h2>
              <select
                className="w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:border-orange-500"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value={""}>Select Option</option>
                <option value={"Cash"}>Cash</option>
                <option value={"Card"}>Card</option>
                <option value={"Cash on Delivery"}>Cash on Delivery</option>
              </select>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-2 mt-2 w-full px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:border-orange-500"
              />
              <button
                className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-green-500"
                onClick={() => onCheckout()}
              >
                Checkout
              </button>

              <button
                className="mt-2 bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-blue-500"
                onClick={() => printReceipt()}
              >
                Print Receipt
              </button>
            </div>
            <div className="mt-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-black p-4 shadow-md rounded-md border border-gray-900"
                >
                  <div className="flex justify-between items-center">
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/bawarchi-61209.appspot.com/o/${item.Name}?alt=media&token=${item.token}`}
                      alt={item.Name}
                      className="w-16 h-16 object-cover rounded-md shadow-md"
                    />
                    <div className="flex flex-col items-right gap-2 text-right">
                      <h2 className="text-xl font-semibold">{item.Name}</h2>
                      <h3 className="text-sm font-semibold text-gray-300">
                        Rs {item.Price}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-blue-500"
                        onClick={() => removeQuantity(item)}
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-blue-500"
                        onClick={() => addQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-red-500"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainScreen;
