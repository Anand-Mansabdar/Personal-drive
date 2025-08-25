const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  }, 
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
    index: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },

  // For sharing files(Phase 4-> next commit)
  sharedWith: [{
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  starredBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  lastAccessedAt:{
    type: Date
  }
})

const folderModel = mongoose.model('Folder', folderSchema)

module.exports = folderModel;