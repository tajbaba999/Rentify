import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./db/schema";
import connectDB from "./db/connection";

dotenv.config({});

const productData = [
  {
    product_id: 1,
    product_name: "WD 4TB Gaming Drive",
    product_category: "Electronics",
    product_description: "Expand your PS4 gaming experience, Play anywhere.",
    product_price: 114.55,
    product_stock: 50,
    product_image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
  },
  {
    product_id: 2,
    product_name: "SanDisk SSD PLUS 1TB",
    product_category: "Electronics",
    product_description:
      "Easy upgrade for faster boot-up, shutdown, and response.",
    product_price: 109.0,
    product_stock: 75,
    product_image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
  },
  {
    product_id: 3,
    product_name: "Samsung Galaxy Tab A 8.0",
    product_category: "Electronics",
    product_description:
      "1280 x 800 Resolution Display, 16GB Storage, Android 7.0 OS.",
    product_price: 149.99,
    product_stock: 40,
    product_image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
  },
  {
    product_id: 4,
    product_name: "Men's Cotton Jacket",
    product_category: "Men's Clothing",
    product_description: "Great outerwear jacket for Spring/Autumn/Winter.",
    product_price: 55.99,
    product_stock: 100,
    product_image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
  },
  {
    product_id: 5,
    product_name: "Women's 3-in-1 Snowboard Jacket",
    product_category: "Women's Clothing",
    product_description:
      "US standard size, please choose size as your usual wear.",
    product_price: 56.99,
    product_stock: 80,
    product_image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
  },
  {
    product_id: 6,
    product_name: "Fjallraven - Foldsack No. 1 Backpack",
    product_category: "Men's Clothing",
    product_description:
      "Your perfect pack for everyday use and walks in the forest.",
    product_price: 109.95,
    product_stock: 60,
    product_image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  },
  {
    product_id: 7,
    product_name: "Solid Gold Petite Micropave Necklace",
    product_category: "Jewelry",
    product_description:
      "Rose Gold Necklace, 14K Solid Gold Petite Micropave Set.",
    product_price: 168.99,
    product_stock: 30,
    product_image:
      "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
  },
  {
    product_id: 8,
    product_name: "White Gold Plated Princess Ring",
    product_category: "Jewelry",
    product_description:
      "Classic Created Wedding Engagement Solitaire Diamond Ring.",
    product_price: 9.99,
    product_stock: 150,
    product_image:
      "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
  },
  {
    product_id: 9,
    product_name: "WD 2TB Elements Portable External Hard Drive",
    product_category: "Electronics",
    product_description:
      "USB 3.0 and USB 2.0 Compatibility with Fast Data Transfers.",
    product_price: 64.0,
    product_stock: 90,
    product_image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
  },
  {
    product_id: 10,
    product_name: "55-inch Smart LED TV",
    product_category: "Electronics",
    product_description:
      "4K UHD resolution, smart features, voice assistant support.",
    product_price: 699.99,
    product_stock: 25,
    product_image:
      "https://res.cloudinary.com/dcowajfbl/image/upload/v1729960403/Freelance/tv_image.jpg",
  },
  {
    product_id: 11,
    product_name: "Energy-Efficient Air Conditioner",
    product_category: "Appliances",
    product_description: "Cooling and heating options with smart control.",
    product_price: 299.99,
    product_stock: 35,
    product_image:
      "https://res.cloudinary.com/dcowajfbl/image/upload/v1729960403/Freelance/hro7lspk3svwhtwruesm.jpg",
  },
  {
    product_id: 12,
    product_name: "Top-Loading Washing Machine",
    product_category: "Appliances",
    product_description:
      "Multiple wash settings, energy-efficient, high capacity.",
    product_price: 499.99,
    product_stock: 20,
    product_image:
      "https://res.cloudinary.com/dcowajfbl/image/upload/v1729960403/Freelance/qpyudqnwdi3n3w1kgm0o.jpg",
  },
];

const seedDb = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log(`Cleared the existing DB`);

    await Product.insertMany(productData);
    console.log("Successfully seeded products");

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDb();
