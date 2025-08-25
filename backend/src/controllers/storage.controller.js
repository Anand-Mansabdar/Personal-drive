const path = require('path');
const fs = require('fs').promises;
const File = require('../models/file.model');
const Folder = require('../models/folder.model');
const mongoose = require('mongoose');

const createFolder = async (req, res, next) => {
  try {
    const {name, parentFolder} = req.body;
    const folder = await Folder.create({
      name, owner: req.userId, parentFolder: parentFolder || null
    });
    return res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
}

const getFolderContents = async (req, res, next) => {
  try {
    const folderId = req.params.id === 'root' ? null: req.params.id;
    const filter = { owner: req.userId, parentFolder: folderId };
    const [folders, files, currentFolder] = await Promise.all([
      Folder.find(filter).sort({name: 1}),
      File.find(filter).sort({originalName: 1}),
      folderId? Folder.findOne({_id: folderId, owner: req.userId}) : null
    ]);
    return res.status(201).json({
      currentFolder, folders, files
    });
  } catch (error) {
    next(error);
  }
}


const downloadFile = async (req, res, next) => {
  try{
    const file = await File.findOne({_id: req.params.id});
    if(!file){
      return res.status(404).json({
        message:'File not found...'
      });
    }

    if(file.owner.toString() !== req.userId){
      return res.status(403).json({
        message: 'You do not have permission to access this file.'
      });
    }

    file.lastAccessed = new Date();
    await file.save();

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.sendFile(path.resolve(file.storagePath));
  } catch(error){
    next(error);
  }
}

const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({_id: req.params.id, owner: req.userId});
    if(!file){
      return res.status(404).json({
        message: 'File not found...'
      });
    }

    await fs.unlink(file.storagePath).catch(() => {});
    await file.deleteOne();
    return res.status(200).json({
      message: 'File deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

const renameItem = async (req, res, next) => {
  try {
    const {name} = req.body;
    const {id} = req.params;
    // Try folder first
    let item = await Folder.findOne({_id: id, owner: req.userId});
    if(item){
      item.name = name;
      await item.save();
      return res.json(item);
    }
    // File
    item = await File.findOne({_id: id, owner: req.userId});
    if(!item){
      return res.status(404).json({
        message: 'File not found...'
      });
    }
    item.originalName = name;
    await item.save();
    return res.json(item);
  } catch (error) {
    next(error);
  }
}

const deleteFolderRecursive = async (userId, id) => {
  const childrenFolders =await Folder.find({owner: userId, parentFolder: id}).select('_id');

  for(const f of childrenFolders){
    await deleteFolderRecursive(userId, f._id);
  }

  const files = await File.find({
    owner: userId,
    parentFolder: id
  });
  for(const file of files){
    await fs.unlink(file.storagePath).catch(() => {});
    await file.deleteOne();
  }
  await Folder.deleteOne({_id: id});
}

const deleteFolder = async (req, res, next) => {
  try {
    const folder = Folder.findOne({_id: req.params.id, owner: req.userId});
    if(!folder){
      return res.status(404).json({
        message: 'Folder not found'
      });
    }
    await deleteFolderRecursive(req.userId, folder._id);
    return res.status(200).json({
      message: 'Folder deleted'
    });
  } catch (error) {
    next(error);
  }
}

const uploadFile = async (req, res, next) => {
  try {
    const parentFolder = req.body.parent || null;
    const {filename, originalName, mimetype, size, path: storagePath} = req.file;
    const file = await File.create({
      fileName: filename,
      originalName: originalName,
      mimeType: mimetype,
      size,
      storagePath,
      owner: req.userId,
      parentFolder
    });
    return res.status(201).json(file);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  createFolder,
  getFolderContents,
  downloadFile,
  deleteFile,
  renameItem,
  deleteFolder
}