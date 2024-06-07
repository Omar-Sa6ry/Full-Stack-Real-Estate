const mongoose = require('mongoose')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONG0DB_URL)
    console.log('Database Connection established')
  } catch (err) {
    console.log('error', err)
    const error = appError.create(
      'Some Things Went Wrong in Database,Please Try Again later',
      400,
      httpStatusText.FAIL
    )
    return next(error)
  }
}

module.exports = dbConnect