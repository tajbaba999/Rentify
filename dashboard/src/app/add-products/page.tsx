"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const AddProducts = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({
      productName,
      productCategory,
      productDescription,
      productPrice,
      productStock,
      productImage,
    });
  };

  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImage, setProductImage] = useState("");

  return (
    <div className="flex items-end justify-end w-full ml-72">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md p-6 bg-zinc-900 rounded-lg shadow-md"
      >
        {[
          {
            id: "product_name",
            label: "Product Name",
            value: productName,
            setValue: setProductName,
            type: "text",
            placeholder: "Enter product name",
          },
          {
            id: "product_category",
            label: "Product Category",
            value: productCategory,
            setValue: setProductCategory,
            type: "text",
            placeholder: "Enter product category",
          },
          {
            id: "product_description",
            label: "Product Description",
            value: productDescription,
            setValue: setProductDescription,
            type: "text",
            placeholder: "Enter product description",
          },
          {
            id: "product_price",
            label: "Product Price",
            value: productPrice,
            setValue: setProductPrice,
            type: "number",
            placeholder: "Enter product price",
          },
          {
            id: "product_stock",
            label: "Product Stock",
            value: productStock,
            setValue: setProductStock,
            type: "number",
            placeholder: "Enter product stock",
          },
          {
            id: "product_image",
            label: "Product Image URL",
            value: productImage,
            setValue: setProductImage,
            type: "text",
            placeholder: "Enter product image URL",
          },
        ].map(({ id, label, value, setValue, type, placeholder }) => (
          <div className="flex flex-col" key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <Input
              id={id}
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              placeholder={placeholder}
              className="border rounded-md p-2"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
