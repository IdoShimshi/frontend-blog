import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()


const userData: Prisma.UserCreateInput[] = [];
let k:number = 1;

for (let i = 0; i < 10000; i++) {
  const name = `User${i}`;
  const email = `user${i}@example.com`;
  const posts = {
    create: [] as Prisma.PostCreateWithoutAuthorInput[]
  };


  for (let j = 0; j < 100; j++) {
    posts.create.push({
      title: `Post ${k}`,
      content: `example content ${j+1}`,
      published: true,
    });
    k++;
  }
  
  userData.push({ name, email, posts });
}

async function main() {
  console.log(`Start deleting previous records...`)
  await prisma.user.deleteMany({});
  console.log(`Finished deleting previous records.`)
  await prisma.post.deleteMany({});
  console.log(`Finished deleting previous posts.`)

  console.log(`Start seeding ...`)
  for (const u of userData) {
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
