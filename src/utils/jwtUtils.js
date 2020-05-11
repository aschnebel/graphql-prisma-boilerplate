import jwt from 'jsonwebtoken'

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7 days',
  })

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

export { generateToken, verifyToken }
