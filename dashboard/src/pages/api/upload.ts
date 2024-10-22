import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { image } = req.body;

    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });

      res.status(200).json({ url: uploadResponse.secure_url });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ error: "Cloudinary upload failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
