const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  storagePath: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    index: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  sharedWith: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      permission: {
        type: String,
        enum: ["view", "edit"],
        default: "view",
      },
    },
  ],
  starredBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});


const fileModel = mongoose.model('File', fileSchema);

module.exports = fileModel;