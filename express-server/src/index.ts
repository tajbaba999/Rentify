import pkg from 'pg';
const { Pool } = pkg;
import express, { Request, Response } from "express";
import dotenv, { config } from "dotenv";
import cors from "cors";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { orders, products, userUploads } from "./db/schema.js";
import cloudinary from "cloudinary";
import multer from "multer";

// Configure environment
config();

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode.");
  dotenv.config({ path: ".prod.env" });
} else {
  console.log("Running in development mode.");
  dotenv.config({ path: ".dev.env" });
}

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error("Error executing query:", err);
  res.status(500).json({ error: "Internal server error." });
};

// Routes

// Get all products
app.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get single product
app.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(products).where(eq(products.id, Number(id)));

    if (!rows.length) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Create an order
app.post("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, start_date, end_date, productIdsArray, orderTotal, house_number, city, state, country, pincode } = req.body;

    if (!Array.isArray(productIdsArray) || productIdsArray.some(isNaN)) {
      res.status(400).json({ error: "productIdsArray must be an array of integers." });
      return;
    }

    const order = await db.transaction(async (trx) => {
      const [newOrder] = await trx.insert(orders).values({
        customer_email: email,
        start_date,
        end_date,
        product_ids: productIdsArray,
        total: orderTotal,
        house_number,
        city,
        state,
        country,
        pincode,
      }).returning();

      const productPrices = await Promise.all(
        productIdsArray.map(async (productId: number) => {
          const [product] = await trx.select().from(products).where(eq(products.id, productId));
          if (!product) throw new Error(`Product with id ${productId} not found`);
          return product.product_price;
        })
      );

      const total = productPrices.reduce((acc, price) => acc + price, 0);

      const [updatedOrder] = await trx.update(orders).set({ total }).where(eq(orders.id, newOrder.id)).returning();

      return updatedOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Upload file to Cloudinary
app.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, userId } = req.body;
    if (!req.file || !email || !userId) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    cloudinary.v2.uploader.upload_stream({ folder: "user_uploads" }, async (error, result) => {
      if (error || !result) {
        res.status(500).json({ error: "Cloudinary upload failed." });
        return;
      }

      await db.insert(userUploads).values({
        email,
        user_id: userId,
        file_url: result.secure_url,
      });

      res.status(201).json({ message: "File uploaded successfully.", fileUrl: result.secure_url });
    }).end(req.file.buffer);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "An error occurred during upload." });
  }
});

// Add a new product
app.post("/addproducts", async (req: Request, res: Response): Promise<void> => {
  try {
    const { productName, productCategory, productDescription, productPrice, productStock, productImage } = req.body;

    if (!productName || !productCategory || !productPrice || !productStock) {
      res.status(400).json({ error: "Missing required product details." });
      return;
    }

    const newProduct = await db.insert(products).values({
      product_name: productName,
      product_category: productCategory,
      product_description: productDescription,
      product_price: productPrice,
      product_stock: productStock,
      product_image: productImage,
    }).returning();

    res.status(201).json(newProduct);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get all orders
app.get("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await db.select().from(orders);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Delete an order
app.delete("/orders/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOrder = await db.delete(orders).where(eq(orders.id, Number(id))).returning();

    if (!deletedOrder.length) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Delete a product
app.delete("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await db.delete(products).where(eq(products.id, Number(id))).returning();

    if (!deletedProduct.length) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});