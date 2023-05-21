import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import { addVideoMetadata } from "../../mongoDB/videoCollection";

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

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = data?.files?.inputFile.filepath;
  const postId = data?.fields?.postId; 

  const response = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'video',
    public_id: postId,
    folder: "blog-videos"
  });

  addVideoMetadata(postId,response.public_id);


  return res.json(response);
};