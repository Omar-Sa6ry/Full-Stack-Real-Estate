const appError = require('../utils/appError')
const Estate = require('../models/estateModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const httpStatusText = require('../utils/httpStatusText')
const validationMongoDbId = require('../utils/validationMongoDbId')

// Create a new estate

const createEstate = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user
    validationMongoDbId(_id)

    const newestate = await Estate.create({ ...req.body, owner: _id })
    res.json(newestate)
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Get all estates

const getAllEstates = asyncHandler(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit)
    const estates = await Estate.find()?.limit(limit)

    res.json(estates)
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Get all estates for user
const getAllEstatesUser = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user
    validationMongoDbId(_id)

    const estates = await Estate.find({ owner: _id })
    res.json(estates)
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Get Email from Owner

const getEmailFromOwner = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findOne({ _id: id })
    if (!user) {
      const error = appError.create(
        'User is not Existed',
        400,
        httpStatusText.FAIL
      )
      return next(error)
    }

    const email = user?.email
    res.json(email)
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Delete an estate

const deletedEstate = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user
    validationMongoDbId(_id)

    const { id } = req.params
    const estate = await Estate.findByIdAndDelete({ _id: id })
    res.json({
      status: httpStatusText.SUCCESS,
      message: 'Estate is already deleted'
    })
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Get a Single estate

const getSingleEstate = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params
    const estate = await Estate.findById({ _id: id })
    if (estate) {
      res.json(estate)
    } else {
      const error = appError.create(
        'Estate is not exits',
        404,
        httpStatusText.ERROR
      )
      return next(error)
    }
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Update an Estate

const updatedEstate = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params

    const estate = await Estate.findByIdAndUpdate({ _id: id }, req.body, {
      new: true
    })
    if (estate) {
      res.json(estate)
    } else {
      const error = appError.create(
        'Estate is not exits',
        404,
        httpStatusText.ERROR
      )
      return next(error)
    }
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

const searchEstate = asyncHandler(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9
    const startIndex = parseInt(req.query.startIndex) || 0
    const sort = req.query.sort || 'createdAt'
    const searchTerm = req.query.searchTerm || ''
    const order = req.query.order || 'desc'
    let offer = req.query.offer
    let furnished = req.query.furnished
    let parking = req.query.parking
    let type = req.query.type

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] }
    }
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] }
    }
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] }
    }
    if (type === undefined || type === 'all') {
      type = { $in: ['Sale', 'Rent'] }
    }

    const estates = await Estate.find({
      name: { $regex: searchTerm, $options: 'i' }, // i for lower and captial and regex in first, middle or end
      offer,
      type,
      furnished,
      parking
    })
      ?.sort({ [sort]: order })
      // ?.limit(limit)
      // ?.skip(startIndex)

    if (!estates) {
      res.json('No Data')
    }

    res.json(estates)
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

module.exports = {
  createEstate,
  getAllEstates,
  getAllEstatesUser,
  getSingleEstate,
  updatedEstate,
  searchEstate,
  getEmailFromOwner,
  deletedEstate
}
