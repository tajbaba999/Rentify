"use client"; // Make sure this line is correctly spelled and at the top
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  product_image: string;
  product_name: string;
  product_price: number;
  product_description: string;
  product_stock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (productId: number) => {
    try {
      await axios.delete(`http://localhost:8000/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      ); // Update the local state
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex ml-24 pl-52 items-center justify-center h-screen w-full">
        <div className="loader"></div> {/* Circle loader instead of text */}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              imageUrl={product.product_image}
              title={product.product_name}
              price={product.product_price}
              description={product.product_description}
              stock={product.product_stock}
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded hover:bg-red-600 px-2 py-1"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;
