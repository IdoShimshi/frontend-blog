import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IncomingForm, Fields, Files } from 'formidable';
import { addVideoMetadata } from "../../mongoDB/videoCollection";
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
  const postIds = data?.fields?.postId; 
  const postId = Array.isArray(postIds) ? postIds[0] : postIds;

  if (file && postId){
    const response: UploadApiResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'video',
        public_id: "video-"+postId,
      });
    
    addVideoMetadata(Number(postId), response.public_id);
    res.json(response);
  }
};
