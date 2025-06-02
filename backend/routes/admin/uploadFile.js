const express = require('express')
const router = express.Router()
const upload = require('../../middleware/uploadFile')
const { uploadFile } = require('../../controllers/uploadFileController')

router.post('/', upload.single('file'), uploadFile)

module.exports = router