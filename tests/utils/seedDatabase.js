import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
  input: {
    name: 'Frank',
    email: 'frank@example.de',
    password: bcrypt.hashSync('E_9!c2TjWv'),
  },
  user: null,
  jwt: null,
}

const seedDatabase = async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  //Delete Testdata
  await prisma.mutation.deleteManyUsers()

  //Create UserOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)
}

export { seedDatabase, userOne }
