import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt';


export default async function handleSignup(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST'){
    const { username, password, email, name } = req.body;

    const user_by_username = await prisma.user.findFirst({
        where:{
          username: username
        }
      })

      if(user_by_username){
        console.log("user_by_username_error")
        return res.status(403).json({
            error: "User with this username already exists"
        })
      }
      const user_by_email = await prisma.user.findFirst({
        where:{
          'email': email
        }
      })

      if(user_by_email){
        console.log("user_by_email_error")
        return res.status(403).json({
            error: "User with this email already exists"
        })
      }
      const passwordHash = await bcrypt.hash(password, 10)

      const result = await prisma.user.create({
        data: {
          username: username,
          passwordHash: passwordHash,
          email: email,
          name: name,
        },
      });
      console.log(result)
      if (result && result.passwordHash && await bcrypt.compare(password, result.passwordHash)){
        res.status(200).send({})
      }
      else{
        return res.status(401).json({
            error: 'Sign up failed'
          })
      }
  }
}
