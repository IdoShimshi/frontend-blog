import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()


const userData: Prisma.UserCreateInput[] = [];
let k:number = 1;

const makeuserdata = (async () => {
  const userData: Prisma.UserCreateInput[] = [];
  for (let i = 0; i < 100; i++) {
    const name = `User${i}`;
    const username = `User${i}`;
    const email = `user${i}@example.com`;
    const password = `user${i}pass`
    const passwordHash = await bcrypt.hash(password, 10);
  
    const posts = {
      create: [] as Prisma.PostCreateWithoutAuthorInput[]
    };
  
  
    for (let j = 0; j < 10; j++) {
      posts.create.push({
        title: `Post ${k}`,
        content: `example content ${j+1}`,
        published: true,
      });
      k++;
    }
    
    userData.push({ username, name, email, passwordHash, posts });
  }
  return userData;
});


async function main() {
  const userdata = makeuserdata();
  console.log(`Start deleting previous records...`)
  await prisma.user.deleteMany({});
  console.log(`Finished deleting previous records.`)
  await prisma.post.deleteMany({});
  console.log(`Finished deleting previous posts.`)
  const userData1: Prisma.UserCreateInput[] = await userdata;
  console.log(`Start seeding ...`)
  for (const u of userData1) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
