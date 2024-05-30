const express = require('express')
const estateCtrl = require('../controller/estateCtrl')
const { authMiddlewares } = require('../middlewares/authMiddlewares')

const router = express.Router()

router.post('/create-estate', authMiddlewares, estateCtrl?.createEstate)
router.put('/:id', authMiddlewares, estateCtrl?.updatedEstate)
router.delete('/:id', authMiddlewares, estateCtrl?.deletedEstate)
router.get('/all-estates-user', authMiddlewares, estateCtrl?.getAllEstatesUser)
router.get('/all-estates', estateCtrl?.getAllEstates)
router.get('/search-estates', estateCtrl?.searchEstate)
router.get('/:id', estateCtrl?.getSingleEstate)
router.get('/user/:id', estateCtrl?.getEmailFromOwner)

module.exports = router
