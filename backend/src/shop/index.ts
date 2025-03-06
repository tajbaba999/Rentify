import express, { Request, Response } from "express";
import {
  Product,
  Order,
  OrderProduct,
  UserUpload,
  IProduct,
} from "../db/schema";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all products
router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }
);

// Create new product
router.post("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.put(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

// Delete product
router.delete(
  "/products/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

// Get order by ID with populated products
// router.get(
//   "/orders/:id",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const order = await Order.findById(req.params.id);
//       if (!order) {
//         res.status(404).json({ error: "Order not found" });
//         return;
//       }
//       const orderProducts = await OrderProduct.find({ order_id: order._id });
//       const productsWithQuantity = await Promise.all(
//         orderProducts.map(async (op) => {
//           const product = await Product.findById(op.product_id);
//           return {
//             product,
//             quantity: op.quantity,
//           };
//         })
//       );
//       const orderWithProducts = order.toObject();
//       orderWithProducts.products = productsWithQuantity.filter(
//         (item): item is { product: IProduct; quantity: number } => item.product !== null
//       );
//       res.json(orderWithProducts);
//     } catch (error) {
//       console.error("Error fetching order:", error);
//       res.status(500).json({ error: "Failed to fetch order" });
//     }
//   }
// );

// Create new order
router.post("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    if (req.body.products && Array.isArray(req.body.products)) {
      for (const item of req.body.products) {
        const orderProduct = new OrderProduct({
          order_id: newOrder._id,
          product_id: item.product_id,
          quantity: item.quantity,
        });
        await orderProduct.save();
      }
    }
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/orders/", async (req: Request, res: Response): Promise<void> => {
  try {
    const Orders = await Order.find({});
    if (!Orders) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(Orders);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.get(
  "/orders/:email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({ customer_email: req.params.email });

      if (!orders.length) {
        res.status(404).json({ error: "No orders found for this email" });
        return;
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }
);

router.put(
  "/orders/:email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedOrder) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  }
);

router.delete(
  "/orders/:email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await OrderProduct.deleteMany({ customer_email: req.params.email });
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
);

// Upload file endpoint
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const fileStr = Buffer.from(req.file.buffer).toString("base64");
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${fileStr}`,
        { folder: "shop-uploads" }
      );
      const newUpload = new UserUpload({
        email: req.body.email,
        user_id: req.body.user_id,
        file_url: uploadResponse.secure_url,
      });
      await newUpload.save();
      res.json({
        message: "File uploaded successfully",
        file_url: uploadResponse.secure_url,
        upload_id: newUpload._id,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

router.get("/upload", async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const filter = user_id ? { user_id } : {};

    const uploads = await UserUpload.find(filter);
    res.status(200).json({
      uploads,
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

export default router;
