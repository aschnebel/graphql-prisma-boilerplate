import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import { createUser, getProfile, getUsers, login } from './utils/operations'
import { seedDatabase, userOne } from './utils/seedDatabase'
import getTestClient from './utils/getTestClient'

const client = getTestClient()

beforeEach(seedDatabase)

describe('createUser', () => {
  it('should create a new user', async () => {
    const variables = {
      data: {
        name: 'Alba',
        email: 'alba@example.com',
        password: 'gUefS277vf#72Vp_',
      },
    }

    const response = await client.mutate({
      mutation: createUser,
      variables,
    })

    const userExists = await prisma.exists.User({
      id: response.data.createUser.user.id,
    })

    expect(userExists).toBeTruthy()
  })

  it('should throw error when password is to short', async () => {
    const variables = {
      data: {
        name: 'Matthew',
        email: 'matthew@example.com',
        password: '3rr_X7',
      },
    }

    await expect(
      client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
  })
})

describe('Query User', () => {
  it('should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].name).toBe('Frank')
    expect(response.data.users[0].email).toBe(null)
  })
})

describe('loginUser', () => {
  it('should not login with bad credentials', async () => {
    const variables = {
      data: {
        email: 'frank@example.de',
        password: 'wrong_password',
      },
    }

    await expect(
      client.mutate({ mutation: login, variables })
    ).rejects.toThrow()
  })
})

describe('me', () => {
  it('should fetch user profile', async () => {
    const client = getTestClient(userOne.jwt)

    const { data } = await client.query({ query: getProfile })
    expect(data.me.id).toEqual(userOne.user.id)
    expect(data.me.name).toEqual(userOne.user.name)
    expect(data.me.email).toEqual(userOne.user.email)
  })
})
