const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Temporary filename before hashing (will rename later)
    const ext = path.extname(file.originalname);
    const tempName = `${Date.now()}-temp${ext}`;
    cb(null, tempName);
  }
});

const upload = multer({ storage });

module.exports = upload;
