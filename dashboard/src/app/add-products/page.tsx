"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming you have a custom Input component

const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productImage) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    formData.append("productPrice", productPrice);
    formData.append("productStock", productStock);
    formData.append("image", productImage); // Append the image file

    try {
      const response = await fetch("/api/addproducts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message); // Show success message
        alert("Product added successfully!"); // Show an alert with the message
      } else {
        alert("Failed to add product: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div className="flex items-end justify-end w-full ml-52">
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

        {/* File Input for Image Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="product_image"
            className="block text-sm font-medium mb-1"
          >
            Product Image <span className="text-red-500">*</span>
          </label>
          <input
            id="product_image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setProductImage(e.target.files[0]);
              }
            }}
            required
            className="border rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
        >
          Add Product
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-500 text-white rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AddProducts;
