import express, { Request, Response } from "express";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
const router = express.Router();
import { drizzle } from "drizzle-orm/node-postgres";
import { orders, products } from "./db/schema";

const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error("Error executing query:", err);
  res
    .status(500)
    .json({ error: "An error occurred while executing the query." });
};

// Get all products
router.get("/products", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

router.get("/hello", (req, res) => {
  res.json({ send: "Hello world" });
});

router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(products).where(eq(products.id, +id));
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const { email, start_date, end_date, productIdsArray, orderTotal } =
      req.body;

    // Validate the product IDs
    if (!Array.isArray(productIdsArray) || productIdsArray.some(isNaN)) {
      return res
        .status(400)
        .json({ error: "productIdsArray must be an array of integers." });
    }

    // Perform the transaction to create the order
    const order = await db.transaction(async (trx) => {
      const [newOrder] = await trx
        .insert(orders)
        .values({
          customer_email: email,
          start_date,
          end_date,
          product_ids: productIdsArray,
          total: orderTotal,
        })
        .returning();

      // Get the prices for the products using the productIdsArray
      const productPrices = await Promise.all(
        productIdsArray.map(async (productId: number) => {
          const [res] = await db
            .select()
            .from(products)
            .where(eq(products.id, productId));
          if (!res) {
            throw new Error(`Product with id ${productId} not found`);
          }
          return res.product_price;
        })
      );

      // Calculate the overall total
      const total = parseFloat(
        productPrices
          .reduce((acc: number, currPrice: number) => {
            return acc + currPrice;
          }, 0)
          .toFixed(2)
      );

      // Update the total in the orders table
      const [updatedOrder] = await trx
        .update(orders)
        .set({ total })
        .where(eq(orders.id, newOrder.id))
        .returning();

      return updatedOrder;
    });

    res.json(order);
  } catch (err) {
    handleQueryError(err, res);
  }
});

router.get("/orders", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(orders);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, +id))
      .returning();

    if (deletedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(204).send();
  } catch (err) {
    handleQueryError(err, res);
  }
});

export default router;
