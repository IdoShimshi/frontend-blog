import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { loginDetailsProp } from '../../_app';

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  
  const postId = req.query.id;

  const loggedUserJSON = req.cookies.loginDetails
  if (loggedUserJSON) {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: { published: true },
    });
    res.json(post);
  }else{
    res.status(403).send({ message: 'Unauthorized' })
  }

}
