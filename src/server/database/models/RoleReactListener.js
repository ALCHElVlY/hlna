const mongoose = require('mongoose');

const RoleReactSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true,
  },
  emojis: [
    {
      emoji_id: {
        type: String,
        required: true,
        unique: true,
      },
      emoji_name: {
        type: String,
        required: true,
      },
      emoji_type: {
        type: String,
        required: true,
      },
    },
  ],
  roles: [
    {
      role_id: {
        type: String,
        required: true,
        unique: true,
      },
      role_name: {
        type: String,
        required: true,
      },
    },
  ],
});

const RoleReactListener = mongoose.model(
  'role_react_listener',
  RoleReactSchema,
);
module.exports = RoleReactListener;
