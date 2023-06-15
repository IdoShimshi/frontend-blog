import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt';
import {SignJWT} from 'jose';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {


  if (req.method === 'POST'){
    let token: string = '';
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
          if (process.env.SECRET){
            token = await new SignJWT({...userForToken})
            .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
            .sign(new TextEncoder().encode(process.env.SECRET));
          }
            
          else 
            console.log("secret not set");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({...userForToken, token: token}));
        // res.status(200).send({...userForToken, token: token})
    }
    else{
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: 'invalid username or password'
      }));
    }

  }
}
