const router = require('express').Router();
const { getAllUsers, createUser, getUser, login } = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getUser);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
