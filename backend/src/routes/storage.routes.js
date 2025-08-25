const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../storage/multer');
const {uploadFile, downloadFile, deleteFile, getFolderContents, createFolder, renameItem, deleteFolder} = require('../controllers/storage.controller');

router.post('/folders', auth, createFolder);
router.get('/folders/:id', auth, getFolderContents);
router.patch('/folders/:id',auth, renameItem);
router.delete('folders/:id', auth, deleteFolder);


router.post('/files/upload', auth, upload.single('file'), uploadFile);
router.get('/files/:id',auth, downloadFile);
router.patch('/files/:id', auth, renameItem);
router.delete('/files/:id', auth, deleteFile);


module.exports = router;