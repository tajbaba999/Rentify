"use client";
import React from "react";
import Image from "next/image";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  description,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <Image
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={title}
        width={400}
        height={300}
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <p className="text-gray-900 font-semibold text-lg">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
