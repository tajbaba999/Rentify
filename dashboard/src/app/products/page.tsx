"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-zinc-900 ">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          imageUrl={product.image}
          title={product.title}
          price={product.price}
          description={product.description}
        />
      ))}
    </div>
  );
};

export default Products;
