const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { groupId, receiverId, message } = req.body;
  const senderId = req.user.userId;
  try {
    const newMessage = new Message({ groupId, senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIndividualMessages = async (req, res) => {
  const { userId } = req.user;
  const { receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    }).populate('senderId', 'username').populate('receiverId', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await Message.find({ groupId }).populate('senderId', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
