// src/pages/api/post.ts
import { csrf } from "../../../lib/csrf";
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, loginDetails } = req.body;

  if (loginDetails) {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: loginDetails.email } },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
};
