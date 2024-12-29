import { v2 as cloudinary } from "cloudinary";
// import 'dotenv'

import { response } from "express";
import fs from "fs";
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});
const uploadCloudinary=async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
      const response=  await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto",
        })
        //file has been uploaded successfully
        // console.log("File is uploaded in cloudinay",response.url);
        fs.unlinkSync(localfilepath)
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath);
        //remove the loally saved temporary file as the upload operation got failed

        return null;
        
    }
}
const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
// console.log(uploadResult);
export {uploadCloudinary}