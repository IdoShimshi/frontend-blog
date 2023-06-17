import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { loginDetailsProp } from '../../_app';

// PUT /api/publish/:id
export default async function handlePublish(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;
  let loginDetails:loginDetailsProp;
  const loggedUserJSON = req.cookies.loginDetails
  if (!loggedUserJSON) 
    return res.status(403).send({ message: 'Unauthorized' });
  
  loginDetails = JSON.parse(loggedUserJSON)
  if (!loginDetails.userId)
    return res.status(403).send({ message: 'Unauthorized' });

  const post = await prisma.post.updateMany({
    where: { id: Number(postId), authorId: (loginDetails.userId as number)},
    data: { published: true },
  });
  if (post.count !== 1) 
    return res.status(401).send({ message: 'Post not found' });

  return res.json(post);
}
