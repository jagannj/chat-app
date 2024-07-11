const express = require('express');
const router = express.Router();
const {getGroupMessages,sendMessage,getIndividualMessages} = require('../controllers/chatController');
const authenticate = require('../middleware/authenticate');

// Send a message (group or individual)
router.post('/messages', authenticate, sendMessage);

// Get group messages
router.get('/messages/group/:groupId', authenticate, getGroupMessages);

// Get individual messages
router.get('/messages/individual/:receiverId', authenticate, getIndividualMessages);

module.exports = router;
