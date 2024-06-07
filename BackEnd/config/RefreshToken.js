const jwt = require('jsonwebtoken') // Token
require('dotenv').config()

const generateRefreshToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d'
  })
}

module.exports = { generateRefreshToken }
