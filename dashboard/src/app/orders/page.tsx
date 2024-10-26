"use client"; // Make sure this line is correctly spelled and at the top

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  customer_email: string;
  total: number;
  start_date: string;
  end_date: string;
  product_ids: number[];
  house_number: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get("http://localhost:8000/orders"), // Adjust the endpoint as necessary
          axios.get("http://localhost:8000/products"),
        ]);

        setOrders(ordersResponse.data);

        // Store products in an object for easy access by ID
        const productsMap: { [key: number] } = {};
        productsResponse.data.forEach((product) => {
          productsMap[product.id] = product;
        });
        setProducts(productsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  const deleteOrder = async (orderId: number) => {
    try {
      await axios.delete(`http://localhost:8000/orders/${orderId}`); // Adjust the endpoint as necessary
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      ); // Update the local state
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen pl-72">
        <div className="loader"></div> {/* Add your loading spinner here */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-zinc-900">
      {orders.length === 0 ? (
        <p className="text-white">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-lg dark:bg-zinc-800 shadow-md"
          >
            <h2 className="text-lg font-semibold text-lime-400">
              Order ID: {order.id}
            </h2>
            <div className="flex">
              <p>
                <span className="text-blue-800">Email :</span>{" "}
                {order.customer_email}
              </p>
            </div>
            <div className="flex">
              <p>
                <span className="text-blue-800">Total :</span> $
                {order.total.toFixed(2)}
              </p>
            </div>
            <div className="flex">
              <p>
                <span className="text-red-500">Start Date :</span> $
                {order.start_date}
              </p>
            </div>
            <div className="flex">
              <p>
                <span className="text-red-500">End Date :</span> $
                {order.end_date}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-amber-500">Products:</h3>
              <ul>
                {order.product_ids.map((productId) => (
                  <li key={productId}>
                    {products[productId]?.product_name ||
                      `Product ID ${productId} not found`}
                  </li>
                ))}
              </ul>
            </div>

            {/* Address Details */}
            <div className="mt-4">
              <h3 className="font-bold text-amber-500">Address Details:</h3>
              <p>
                <span className="text-blue-800">House Number:</span>{" "}
                {order.house_number}
              </p>
              <p>
                <span className="text-blue-800">City:</span> {order.city}
              </p>
              <p>
                <span className="text-blue-800">State:</span> {order.state}
              </p>
              <p>
                <span className="text-blue-800">Country:</span> {order.country}
              </p>
              <p>
                <span className="text-blue-800">Pincode:</span> {order.pincode}
              </p>
            </div>

            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => deleteOrder(order.id)}
            >
              Delete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
