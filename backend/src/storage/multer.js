// Local dev storage

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
// Test whether or not the given path exists by checking with the file system. Then call the callback argument with either true or false:
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, {recursive: true});
}

// Returns a StorageEngine implementation configured to store files on the local file system.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

module.exports = multer({ storage });