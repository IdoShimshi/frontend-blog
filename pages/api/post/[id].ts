import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { deletePostMetadata } from '../../../mongoDB/videoCollection';
import { v2 as cloudinary } from 'cloudinary';

// DELETE /api/post/:id
export default async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;

  const loggedUserJSON = req.cookies.loginDetails

  if (req.method === "DELETE") {
    if (loggedUserJSON) {
      const post = await prisma.post.delete({
        where: { id: Number(postId) },
      });
      res.json(post);
      
      const publicId = await deletePostMetadata(Number(postId));
      if (publicId){
        try {
          const deletionResponse = await cloudinary.uploader.destroy(publicId, {resource_type: 'video'});
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
