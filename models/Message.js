const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);