const express = require('express')
const multer = require('multer')

const router = express.Router()
const storage = multer.diskStorage({
  destination: './tmp/uploads',
  filename(req, file, cb) {
    let filename = file.originalname.split('.')
    filename = filename[0] + Date.now() + '.' + filename[1]
    cb(null, filename)
  }
})
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const mimeTypes = [
      // 'application/json',
      // 'application/msword',
      // 'application/pdf',
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      // 'text/html',
    ]
    cb(null, mimeTypes.includes(file.mimetype))
  }
})
const postHandler = require('./../postHandler')
const title = 'CSV Uploader for Watson Discovery Service'

router
  .get('/', (req, res, next) => res.render('index', { title }))
  .post('/', upload.single('sourceFile'), postHandler)

module.exports = router
