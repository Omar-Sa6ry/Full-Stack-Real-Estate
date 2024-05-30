const mongoose = require('mongoose')

const validationMongoDbId = id => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) {
    const error = appError.create(
      'this id is not valid or not found',
      404,
      httpStatusText.ERROR
    )
    return next(error)
  }
}

module.exports = validationMongoDbId
