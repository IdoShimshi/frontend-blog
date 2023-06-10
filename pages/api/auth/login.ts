import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const testuser = {name: 'testman', username: 'test', password: 'testhash123', _id:123};
    const passwordHash = await bcrypt.hash(testuser.password, 10);


  if (req.method === 'POST'){
    let token = null;
    const { username, password } = req.body;

    if (username === testuser.username && await bcrypt.compare(password, passwordHash)){
        const userForToken = {
            username: testuser.username,
            id: testuser._id,
          }
          if (process.env.SECRET)
            token = jwt.sign(userForToken,process.env.SECRET);
          else 
            console.log("secret not set");
        res.status(200).send({token, username: testuser.username, name: testuser.name, id: testuser._id})
    }
    else{
        return res.status(401).json({
            error: 'invalid username or password'
          })
    }

  }
  
  

  
//   if (session) {
//     const result = await prisma.post.create({
//       data: {
//         title: title,
//         content: content,
//         author: { connect: { email: email } },
//       },
//     });
//     res.json(result);
//   } else {
//     res.status(401).send({ message: 'Unauthorized' })
//   }
}
