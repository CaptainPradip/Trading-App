const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn,isOwner } = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator');
const router = express.Router();

//GET /users/new: send html form for creating a new user account

router.get('/new', isGuest, controller.new);

//POST /users: create a new user account

router.post('/', isGuest, controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);
router.get('/trades/:id', validateId, isLoggedIn, controller.showTrades)

router.delete('/delete-trades/:id', validateId, isLoggedIn, isOwner, controller.deleteTrades);
router.delete('/watch/:id', validateId, isLoggedIn, controller.removeToWishList)
//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);
router.post('/offer/:id', validateId, isLoggedIn, controller.makeOffer)
router.delete('/offer/:id', validateId, isLoggedIn, controller.cancelOffer)
router.put('/offer/:id', validateId, isLoggedIn, controller.approveOffer)
router.get('/trades/offer/:id', validateId, isLoggedIn, controller.manageOffer)

module.exports = router;