const express = require('express')
const userAuth = require('../controller/userCtrl')
const { authMiddlewares } = require('../middlewares/authMiddlewares')

const router = express.Router()

// User Controller

router.delete('/delete-user', authMiddlewares, userAuth?.deleteClientUser)
router.post('/login', userAuth?.login)
router.post('/register', userAuth?.register)
router.get('/reset-password/:id/:token', userAuth?.getResetPassword)
router.post('/reset-password/:id/:token', userAuth?.postResetPassword)
router.post('/Forgot-Password-Token', userAuth?.forgotPasswordToken)
router.put('/Change-Password', authMiddlewares, userAuth?.changePassword)
router.put('/edit-user', authMiddlewares, userAuth?.updatedUser)
router.get('/logout', userAuth?.logout)

module.exports = router
