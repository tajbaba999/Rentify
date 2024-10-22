"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";

const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      console.error("Cloudinary cloud name is not defined.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      setImageUrl(data.secure_url); // Cloudinary returns a secure URL for the uploaded image
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productImage) {
      try {
        await handleImageUpload(productImage);

        const productData = {
          productName,
          productCategory,
          productDescription,
          productPrice,
          productStock,
          productImage: imageUrl,
        };

        console.log(productData);

        await axios.post("/api/addproducts", productData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error submitting product:", error);
      }
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
    </div>
  );
};

export default AddProducts;
