"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        // console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex ml-24 pl-52 items-center justify-center  h-screen w-full">
        <div className="loader"></div> {/* Circle loader instead of text */}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.product_image}
            title={product.product_name}
            price={product.product_price}
            description={product.product_description}
            stock={product.product_stock}
          />
        ))}
      </div>
    </>
  );
};

export default Products;
