const GridFSController = require('./gridfsController');
const gridFS = new GridFSController();

exports.getImage = async (req, res) => {
  try {
    await gridFS.streamFile(req.params.id, res, {
      cacheControl: 'public, max-age=31536000'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};