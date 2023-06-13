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
    const result = await prisma.user.findFirst({
      where:{
        username: username
      }
    })
    


    if (result && result.passwordHash && await bcrypt.compare(password, result.passwordHash)){
        const userForToken = {
            email: result.email,
            username: result.username,
            name: result.name,
            id: result.id,
          }
          if (process.env.SECRET)
            token = jwt.sign(userForToken,process.env.SECRET);
          else 
            console.log("secret not set");
        res.status(200).send({...userForToken, token: token})
    }
    else{
        return res.status(401).json({
            error: 'invalid username or password'
          })
    }

  }
}
