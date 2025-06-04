const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const uploadsDir = path.join(__dirname, '../uploads');

    // Generate hash from file contents
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const ext = path.extname(req.file.originalname);
    const hashedFilename = `${hash}${ext}`;
    const finalPath = path.join(uploadsDir, hashedFilename);

    // Check if file with same hash already exists
    if (fs.existsSync(finalPath)) {
      // Delete the newly uploaded duplicate
      fs.unlinkSync(req.file.path);
    } else {
      // Rename uploaded file to hashed name
      fs.renameSync(req.file.path, finalPath);
    }

    const fileUrl = `/uploads/${hashedFilename}`;

    res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
