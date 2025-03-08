import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connection.js";
import { Product } from "./db/schema.js";

// if (process.env.NODE_ENV === "production") {
//   console.log("Running in production mode.");
//   dotenv.config({ path: ".prod.env" });
// } else {
//   console.log("Running in development mode.");
//   dotenv.config({ path: ".dev.env" });
// }

dotenv.config({});

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

import shopRouter from "./shop";
app.use(shopRouter);
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
