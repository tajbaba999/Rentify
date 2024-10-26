import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinaryV2 } from "cloudinary";
import multer from "multer";
import { nextConnect } from "next-connect";

const upload = multer();

cloudinaryV2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nextConnect();

handler.use(upload.single("image"));

handler.post(
  async (req: NextApiRequest & { file?: any }, res: NextApiResponse) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      cloudinaryV2.uploader
        .upload_stream({ resource_type: "image" }, async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Image upload failed", error });
          }

          const {
            productName,
            productCategory,
            productDescription,
            productPrice,
            productStock,
          } = req.body;

          const newProduct = {
            name: productName,
            category: productCategory,
            description: productDescription,
            price: productPrice,
            stock: productStock,
            imageUrl: result?.secure_url, // URL from Cloudinary
          };

          res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
          });
        })
        .end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle multipart/form-data
  },
};
