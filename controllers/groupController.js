const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createGroup = async (req, res) => {
//   const { name, members } = req.body;
  
//   // Validate request body
//   if (!name || !members || !Array.isArray(members)) {
//     return res.status(400).json({ error: 'Name and members are required. Members should be an array.' });
//   }
  
//   try {
//     // Validate each member
//     const validMembers = [];
//     for (const memberId of members) {
//       const user = await User.findById(memberId);
//       if (!user) {
//         return res.status(400).json({ error: `User with ID ${memberId} does not exist.` });
//       }
//       validMembers.push(user._id);
//     }
    
//     // Create and save the group
//     const group = new Group({ name, members: validMembers });
//     await group.save();
    
//     // Populate members and respond
//     await group.populate('members', 'username').execPopulate();
//     res.status(201).json(group);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.addMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
