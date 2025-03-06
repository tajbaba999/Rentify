import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  product_id: number;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_image: string;
}

export interface IOrder extends Document {
  customer_email: string;
  total: number;
  start_date?: string;
  end_date?: string;
  product_ids: number[];
  house_number: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  products?: Array<{
    product: IProduct;
    quantity: number;
  }>;
}

export interface IUserUpload extends Document {
  email: string;
  user_id: string;
  file_url: string;
  created_at: Date;
}

export interface IOrderProduct extends Document {
  order_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  quantity: number;
}

const ProductSchema = new Schema<IProduct>({
  product_id: { type: Number, unique: true },
  product_name: { type: String, required: true },
  product_category: { type: String, required: true },
  product_description: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_stock: { type: Number, required: true },
  product_image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
  customer_email: { type: String, required: true },
  total: { type: Number, default: 0 },
  start_date: { type: String },
  end_date: { type: String },
  product_ids: { type: [Number], required: true },
  house_number: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderProductSchema = new Schema<IOrderProduct>({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const UserUploadSchema = new Schema<IUserUpload>({
  email: { type: String, required: true },
  user_id: { type: String, required: true },
  file_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
export const Order = mongoose.model<IOrder>("Order", OrderSchema);
export const OrderProduct = mongoose.model<IOrderProduct>(
  "OrderProduct",
  OrderProductSchema
);
export const UserUpload = mongoose.model<IUserUpload>(
  "UserUpload",
  UserUploadSchema
);
