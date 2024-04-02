"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const Menu = () => {
  const [products, setProducts] = useState([]);

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

  // Function to group products by category
  const groupProductsByCategory = () => {
    const groupedProducts = {};

    products.forEach((product) => {
      if (!groupedProducts[product.Category]) {
        groupedProducts[product.Category] = [];
      }
      groupedProducts[product.Category].push(product);
    });

    return groupedProducts;
  };

  const groupedProducts = groupProductsByCategory();

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />

      <div className="container mx-auto">
        {/* Render products category by category */}
        {Object.keys(groupedProducts).map((category, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mt-8 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-3/4">
              {groupedProducts[category].map((product, index) => (
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
                        ${product.Price}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
