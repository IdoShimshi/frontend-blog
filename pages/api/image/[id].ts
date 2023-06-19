import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { deleteImageMetadata } from '../../../mongoDB/imageCollection';
import { v2 as cloudinary } from 'cloudinary';

// DELETE /api/image/:id
export default async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id;
  
  const loggedUserJSON = req.cookies.loginDetails

  if (req.method === "DELETE") {
    if (loggedUserJSON) {
      
      const publicId = await deleteImageMetadata(Number(userId));
      console.log(publicId)
      if (publicId){
        try {
          console.log("try", publicId)
          const deletionResponse = await cloudinary.uploader.destroy(publicId, {resource_type: 'image'});
          res.json(deletionResponse);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    } else {
      console.log("else")
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
