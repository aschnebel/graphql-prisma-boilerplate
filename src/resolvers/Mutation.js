import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import { generateToken } from '../utils/jwtUtils'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async login(parent, { data }, { prisma }, info) {
    const { email, password } = data
    const user = await prisma.query.user({ where: { email } })

    if (!user) {
      throw new Error(`Invalid email or password`)
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
      throw new Error(`Invalid email or password`)
    }

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async createUser(parent, { data }, { prisma }, info) {
    const password = await hashPassword(data.password)

    const user = await prisma.mutation.createUser({
      data: { ...data, password },
    })

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const id = getUserId(request)
    return prisma.mutation.deleteUser({ where: { id } }, info)
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const id = getUserId(request)

    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    return prisma.mutation.updateUser({ where: { id }, data }, info)
  },
}

export { Mutation as default }
