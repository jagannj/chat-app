const express = require('express');
const { createGroup, addMember, removeMember,getGroups } = require('../controllers/groupController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/create', authenticate, createGroup);
router.post('/add', authenticate, addMember);
router.post('/remove', authenticate, removeMember);
router.get('/groups', authenticate,getGroups);

module.exports = router;
