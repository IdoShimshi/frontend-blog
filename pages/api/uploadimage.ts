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
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
  const files = data?.files?.inputFile;
  const file = Array.isArray(files) ? files[0]?.filepath : files?.filepath;
  const userIds = data?.fields?.userId; 
  const userId = Array.isArray(userIds) ? userIds[0] : userIds;
  if (file && userId){
    const response: UploadApiResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        public_id: userId,
      });
    addImageMetadata(Number(userId), response.public_id);
    res.json(response);
  }
};
