import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IncomingForm, Fields, Files } from 'formidable';
import { addImageMetadata } from "../../mongoDB/imageCollection";
import { NextApiRequest, NextApiResponse } from 'next';

cloudinary.config({
  cloud_name: "frontend-blog",
  api_key: "193731892552193",
  api_secret: "BxXe6L1ApLZDFIBTgNpMdTAcYXA"
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const data: { fields?: Fields; files?: Files } = await new Promise((resolve, reject) => {
    console.log("20")
    const form = new IncomingForm();
    console.log("22")
    form.parse(req, (err, fields, files) => {
        console.log("24")
      if (err) return reject(err);
      console.log("26")
      resolve({ fields, files });
      console.log("28")
    });
  });
  console.log("31")
  const files = data?.files?.inputFile;
  console.log("33")
  const file = Array.isArray(files) ? files[0]?.filepath : files?.filepath;
  console.log("35")
  const userIds = data?.fields?.userId; 
  console.log("37")
  const userId = Array.isArray(userIds) ? userIds[0] : userIds;
  console.log("39")

  if (file && userId){
    console.log("42")
    const response: UploadApiResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        public_id: userId,
      });
    console.log("47")
    console.log(response)
    addImageMetadata(Number(userId), response.public_id);
    console.log("49")
    res.json(response);
    console.log("51")
  }
};
