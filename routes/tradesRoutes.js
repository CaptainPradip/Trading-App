const express = require('express');
const router = express.Router();
const controller = require('../controllers/tradesController');
const { isLoggedIn, isOwner } = require('../middlewares/auth');
const { validateId, validateTrade, validateResultMiddleware } = require('../middlewares/validator');
const multer = require('multer')
/**
 * File Upload middleware 
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
// GET /trades send all trades to user
router.get('/', controller.index)
// GET /trades/new  send Html Form to create new trades
router.get('/new', isLoggedIn, controller.new)
// POST /trades Create the new Trades
router.post('/', isLoggedIn,upload.single('imageName'),validateTrade,validateResultMiddleware, controller.create)
// GET /trades/:id to get trades details 
router.get('/:id', validateId, controller.show)

// GET /trades/:id/edit this will send edit from for editing existing trades
router.get('/:id/edit', validateId, isLoggedIn, isOwner, controller.edit)
// PUT /trades/:id this will update the trades
router.put('/:id', validateId, isLoggedIn, upload.single('imageName'),validateTrade,validateResultMiddleware, isOwner, controller.update)
// PUT /trades/:id this will delete the trades
router.delete('/:id', validateId, isLoggedIn, isOwner, controller.delete)
router.post('/watch/:id', validateId, isLoggedIn, controller.addToWishList)
router.delete('/watch/:id', validateId, isLoggedIn, controller.removeToWishList)

module.exports = router; 