// src/app/api/upload/route.ts

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// আপনার .env ফাইলের নামের সাথে হুবহু ম্যাচ করে কনফিগার করা হলো
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: 0, message: "কোনো ফাইল পাওয়া যায়নি" }, 
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ক্লাউডিনারিতে স্ট্রিম আপলোড
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "sports_portal", 
          transformation: [
            { width: 1200, crop: "limit" }, 
            { quality: "auto" },            
            { fetch_format: "auto" }        
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return NextResponse.json({
      success: 1, 
      file: {
        url: cloudinaryResponse.secure_url, 
        public_id: cloudinaryResponse.public_id 
      }
    });

  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { success: 0, message: "আপলোড ব্যর্থ হয়েছে", error: error.message }, 
      { status: 500 }
    );
  }
}