// import { timestamp as pgTimestamp } from "console";
import { InferModel, sql } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
  timestamp 
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  product_name: varchar("product_name", { length: 100 }).notNull(),
  product_category: varchar("product_category", { length: 100 }).notNull(),
  product_description: text("product_description").notNull(),
  product_price: doublePrecision("product_price").notNull(),
  product_stock: integer("product_stock").notNull(),
  product_image: text("product_image").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customer_email: varchar("customer_email", { length: 100 }).notNull(),
  total: doublePrecision("total").default(0),
  start_date: varchar("start_date", { length: 50 }),
  end_date: varchar("end_date", { length: 50 }),
  product_ids: integer("product_ids").array().notNull(),

  // New fields added
  house_number: varchar("house_number", { length: 50 }).notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
});

export const order_products = pgTable(
  "order_products",
  {
    order_id: integer("order_id")
      .notNull()
      .references(() => orders.id),
    product_id: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.order_id, table.product_id),
  })
);

export const userUploads = pgTable("user_uploads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  user_id: text("user_id").notNull(),
  file_url: text("file_url").notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`), 
});


export type UserUpload = InferModel<typeof userUploads>;
export type Product = InferModel<typeof products>;
export type Order = InferModel<typeof orders>;
