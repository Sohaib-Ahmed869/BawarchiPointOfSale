"use client"
import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const mainScreen = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const getProducts = () => {
        fetch(`${BACKEND}/admin/product/`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                console.log('Data', data.products);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getProducts();
    }
        , []);


    const addToCart = (product) => {
        const productIndex = cartItems.findIndex(item => item.Name === product.Name);
        if (productIndex === -1) {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        } else {
            const newCartItems = [...cartItems];
            newCartItems[productIndex].quantity += 1;
            setCartItems(newCartItems);
        }
        setTotal(total + product.Price);
    }

    const addQuantity = (product) => {
        const productIndex = cartItems.findIndex(item => item.Name === product.Name);
        const newCartItems = [...cartItems];
        newCartItems[productIndex].quantity += 1;
        setCartItems(newCartItems);
        setTotal(total + product.Price);
    }

    const removeQuantity = (product) => {
        const productIndex = cartItems.findIndex(item => item.Name === product.Name);
        const newCartItems = [...cartItems];
        if (newCartItems[productIndex].quantity === 1) {
            newCartItems.splice(productIndex, 1);
        } else {
            newCartItems[productIndex].quantity -= 1;
        }
        setCartItems(newCartItems);
        setTotal(total - product.Price);
    }

    const removeFromCart = (product) => {
        const productIndex = cartItems.findIndex(item => item.Name === product.Name);
        const newCartItems = [...cartItems];
        newCartItems.splice(productIndex, 1);
        setCartItems(newCartItems);
        setTotal(total - product.Price * product.quantity);
    }

    return (
        <div>
            <Navbar />

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 md:w-3/4">
                    {products.map((product, index) => (
                        <div key={index} className="bg-black p-4 shadow-md rounded-md border border-gray-900">
                            <div className="flex justify-between items-center">
                                <img src={`https://firebasestorage.googleapis.com/v0/b/bawarchi-61209.appspot.com/o/${product.Name}?alt=media&token=${product.token}`} alt={product.Name} className="w-16 h-16 object-cover rounded-md shadow-md" />
                                <div className="flex flex-col items-right gap-2 text-right">
                                <h2 className="text-xl font-semibold">{product.Name}</h2>
                                <h3 className="text-sm font-semibold text-gray-300">${product.Price}</h3>
                                </div>

                            </div>
                            <div className="mt-4">
                                <button className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-orange-500" onClick={() => addToCart(product)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>

                {cartItems.length > 0 && (
                    <div className="mt-8 absolute right-0 top-0 bg-black p-4 shadow-md rounded-md border border-gray-900 h-full w-1/4">
                        <h2 className="text-2xl font-semibold">Cart</h2>
                        <div className="mt-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="bg-black p-4 shadow-md rounded-md border border-gray-900">
                                    <div className="flex justify-between items-center">
                                        <img src={`https://firebasestorage.googleapis.com/v0/b/bawarchi-61209.appspot.com/o/${item.Name}?alt=media&token=${item.token}`} alt={item.Name} className="w-16 h-16 object-cover rounded-md shadow-md" />
                                        <div className="flex flex-col items-right gap-2 text-right">
                                            <h2 className="text-xl font-semibold">{item.Name}</h2>
                                            <h3 className="text-sm font-semibold text-gray-300">${item.Price}</h3>
                                            <div className="flex items-center gap-2">
                                                <button className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-blue-500" onClick={() => removeQuantity(item)}>-</button>
                                                <span className="text-xl font-semibold">{item.quantity}</span>
                                                <button className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-blue-500" onClick={() => addQuantity(item)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-red-500" onClick={() => removeFromCart(item)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">Total: ${total}</h2>
                            <button className="bg-gray-500 text-white px-2 py-1 rounded-md w-full hover:bg-green-500">Checkout</button>
                        </div>
                    </div>
                )}

                

            </div>




        </div>
    )
}

export default mainScreen;