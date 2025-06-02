const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = slugify(base, { lower: true, strict: true }); // remove accents and special chars
    const timestamp = Date.now();
    cb(null, `${timestamp}-${safeBase}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
