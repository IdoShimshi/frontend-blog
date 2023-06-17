import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  // if (req.method === 'POST'){
  //   const { username, email, name } = req.body;

  //   const result = await prisma.user.update({
  //       // email is unique
  //       where:{
  //         email: email
  //       },
  //       data: {
  //           name: name
  //       }
  //     })
  //     console.log(res)
  //     console.log(result)
  //     if(result){
  //       res.status(200).send({})
  //     }
  //     else{
  //       return res.status(401).json({
  //           error: 'Edit profile failed'
  //         })
  //     }
  // }

  const loggedUserJSON = req.cookies.loginDetails
    const { email, name, hasFormData } = req.body;
    const imageValue = hasFormData ? "1" : null
    console.log("formData")
    console.log(hasFormData)
  if (loggedUserJSON) {
    const user = await prisma.user.update({
      where:{
                email: email
              },
              data: {
                  name: name,
                  image: imageValue
              }
    });
    res.json(user);
  }else{
    res.status(403).send({ message: 'Unauthorized' })
  }
}
