import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.KEY_SECRET,
    secure: true,
})

async function HandlerUpload(dataURI : string, file : any){
    
    const resolve = await cloudinary.uploader.upload(dataURI, {
        public_id: file.originalname,
    });
    const result = resolve.url;
    console.log(result);
    return result;
}


export {HandlerUpload};