const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const appError = require('../utils/appError')
const userRoles = require('../utils/userRols')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { sendEmail } = require('../utils/sendEmail')
const Estate = require('../models/estateModel')
const { generateToken } = require('../config/jwtToken')
const httpStatusText = require('../utils/httpStatusText')
const { generateRefreshToken } = require('../config/RefreshToken')
const validationMongoDbId = require('../utils/validationMongoDbId')

const PORT = process.env.PORT || 4000

// Register
const register = asyncHandler(async (req, res, next) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  if (user) {
    const error = appError.create(
      'User is existed ,Change Email',
      400,
      httpStatusText.FAIL
    )
    return next(error)
  } else {
    // Create User
    const newUser = await User.create(req.body)

    const token = generateToken(newUser?._id)
    res.cookie('token', token, { httpOnly: true }).status(200)

    return res.json({
      _id: newUser?._id,
      firstname: newUser?.firstname,
      lastname: newUser?.lastname,
      email: newUser?.email,
      avatar: newUser?.avatar,
      token: generateToken(newUser?._id)
    })
  }
})

// Login

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  try {
    const findUser = await User.findOne({ email: email })
    if (!findUser) {
      const erro = appError.create(
        'Email is not Exist',
        400,
        httpStatusText.FAIL
      )
      return next(erro)
    } else {
      const confirmationPassword = await findUser.isPasswordMatched(password)
      if (findUser && confirmationPassword) {
        // const refreshToken = await generateRefreshToken(findUser?._id) // Refresh token
        // const updatedUser = await User.findByIdAndUpdate(
        //   findUser?.id,
        //   {
        //     refreshToken: refreshToken
        //   },
        //   {
        //     new: true
        //   }
        // )
        // res.cookie('refreshToken', refreshToken, {
        //   httpOnly: true,
        //   maxAge: 72 * 60 * 60 * 1000
        // })

        const token = generateToken(findUser?._id)
        res.cookie('token', token, { httpOnly: true })

        return res.json({
          _id: findUser?._id,
          firstname: findUser?.firstname,
          lastname: findUser?.lastname,
          email: findUser?.email,
          avatar: findUser?.avatar,
          token: token
        })
      } else {
        const error = appError.create(
          'Password is Wrong',
          400,
          httpStatusText.FAIL
        )
        return next(error)
      }
    }
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// LoginAdmin

const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  try {
    const findAdmin = await User.findOne({ email })

    if (!findAdmin) {
      const erro = appError.create(
        'Email is not Exist',
        400,
        httpStatusText.FAIL
      )
      return next(erro)
    }

    if (findAdmin?.roles !== userRoles?.ADMIN) {
      const error = appError.create('Not Authorised', 400, httpStatusText.FAIL)
      return next(error)
    } else {
      const confirmationPassword = await findAdmin.isPasswordMatched(password)
      if (findAdmin && confirmationPassword) {
        const refreshToken = await generateRefreshToken(findAdmin?._id) // Refresh token
        const updatedUser = await User.findByIdAndUpdate(
          findAdmin.id,
          {
            refreshToken: refreshToken
          },
          {
            new: true
          }
        )
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000
        })
        return res.json({
          _id: findAdmin?._id,
          firstname: findAdmin?.firstname,
          lastname: findAdmin?.lastname,
          email: findAdmin?.email,
          avatar: findUser?.avatar,
          password: findAdmin?.password,
          token: generateToken(findAdmin?._id)
        })
      } else {
        const error = appError.create('Invalid User', 400, httpStatusText.FAIL)
        return next(error)
      }
    }
  } catch (err) {
    console.log(err)
    const error = appError.create('Invalid User', 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Logout

const logout = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie('token')
    res.status(200).json('User has been logged out!')
  } catch (err) {
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})
// Update the User

const updatedUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user
  validationMongoDbId(_id)

  const user = await User.findOne({ email: req?.body?.email })
  const oldEmail = await User.findOne({ email: req.user?.email })

  if (oldEmail?.roles === userRoles?.ADMIN) {
    const error = appError.create(
      'This Email is Admin ,You canot Change any Data',
      400,
      httpStatusText.FAIL
    )
    return next(error)
  } else {
    if (user && _id === user?._id) {
      const error = appError.create(
        'User is existed ,Change Email',
        400,
        httpStatusText.FAIL
      )
      return next(error)
    }

    const { password } = req.body
    const confirmationPassword = await oldEmail?.isPasswordMatched(password)

    try {
      if (!confirmationPassword) {
        const error = appError.create(
          'Password is Wrong ,Try again',
          400,
          httpStatusText.FAIL
        )
        return next(error)
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            avatar: req?.body?.avatar
          },
          {
            new: true
          }
        )

        res.json(updatedUser)
      }
    } catch (err) {
      console.log(err)
      const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
      return next(error)
    }
  }
})

// Change Password

const changePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user
  validationMongoDbId(_id)

  const user = await User.findById(_id)

  if (user?.roles === userRoles?.ADMIN) {
    const error = appError.create(
      'This Account is Admin ,You canot Change any Data',
      400,
      httpStatusText.FAIL
    )
    return next(error)
  } else {
    const { oldPassword, newPassword } = req.body
    const confirmationPassword = await user?.isPasswordMatched(oldPassword)

    if (!confirmationPassword) {
      const error = appError.create(
        'Password is Wrong ,Try again',
        400,
        httpStatusText.FAIL
      )
      return next(error)
    } else if (oldPassword === newPassword) {
      const error = appError.create(
        'You Should change your password',
        400,
        httpStatusText.FAIL
      )
      return next(error)
    } else {
      if (newPassword) {
        user.password = newPassword
        const changePassword = await user.save()
        res.json(changePassword)
      } else {
        const error = appError.create(
          'Please ,Enter your New Password',
          400,
          httpStatusText.FAIL
        )
        return next(error)
      }
    }
  }
})

// Delete the Client User

const deleteClientUser = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user
    validationMongoDbId(_id)

    const user = await User.findById(_id)

    if (user?.roles === userRoles?.ADMIN) {
      const error = appError.create(
        'This Account is Admin ,You canot delete it',
        400,
        httpStatusText.FAIL
      )
      return next(error)
    } else {
      const listing = await Estate?.find({ owner: _id })

      if (listing) {
        for (let i = 0; i < listing?.length; i++) {
          const deleteListing = await Estate?.findOneAndDelete({ owner: _id })
        }
      }
      const deleteUser = await User.findByIdAndDelete(_id)
      if (deleteUser) {
        res.clearCookie('token')
        const success = appError.create(
          'User is Deleted successfully',
          200,
          httpStatusText.SUCCESS
        )
        return next(success)
      }
    }
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

// Forget The Password

const forgotPasswordToken = asyncHandler(async (req, res, next) => {
  const { email } = req.body

  try {
    const oldUser = await User.findOne({ email })
    if (!oldUser) {
      const error = appError.create(
        'User is not Exited',
        404,
        httpStatusText.ERROR
      )
      return next(error)
    }
    const userName = oldUser?.firstname
    const secret = process.env.JWT_SECRET_KEY + oldUser?.password
    const token = jwt.sign(
      { email: oldUser?.email, id: oldUser?._id },
      secret,
      {
        expiresIn: '5m'
      }
    )
    const link = `http://localhost:${PORT}/api/user/reset-password/${oldUser?._id}/${token}`

    try {
      // Send Email For Gmail
      const data = {
        to: email,
        text: `Hey ${userName}`,
        subject: 'Forget Password Link',
        html: link
      }
      sendEmail(data)
      res.json('Email sent successfully')
    } catch (error) {
      console.log(error)
      const err = appError.create(
        `Some Things Went Wrog When Sent Link ${error}`,
        400,
        httpStatusText.FAIL
      )
      return next(err)
    }
  } catch (error) {
    const err = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(err)
  }
})

// Reset The Password

const getResetPassword = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params

  const oldUser = await User.findOne({ _id: id })
  if (!oldUser) {
    const error = appError.create(
      'User is not Exited',
      404,
      httpStatusText.ERROR
    )
    return next(error)
  }

  const secret = process.env.JWT_SECRET_KEY + oldUser.password
  try {
    const verify = jwt.verify(token, secret)
    res.render('resetPassword', { email: verify.email, status: 'Not Verified' })
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

const postResetPassword = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params
  const { password } = req.body

  const oldUser = await User.findOne({ _id: id })
  if (!oldUser) {
    return res.json({ status: 'User is Not Existed!' })
  }

  const secret = process.env.JWT_SECRET_KEY + oldUser?.password
  try {
    const verify = jwt.verify(token, secret)
    const encryptedPassword = await bcrypt.hash(password, 10)
    const userr = await User.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          password: encryptedPassword
        }
      }
    )
    res.redirect('http://localhost:3000/login')
  } catch (err) {
    console.log(err)
    const error = appError.create(`${err}`, 400, httpStatusText.FAIL)
    return next(error)
  }
})

module.exports = {
  register,
  login,
  loginAdmin,
  logout,
  updatedUser,
  changePassword,
  deleteClientUser,
  forgotPasswordToken,
  getResetPassword,
  postResetPassword
}
