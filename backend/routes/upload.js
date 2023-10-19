const { v4: uuidv4 } = require('uuid');
const express = require('express');
const multer = require('multer');

const UploadController = require('../controllers/UploadController');
const Helper = require('../helpers/utility');
const photoDir = 'public/photos/original';
const fileDir = 'public/files/';

const router = express.Router();

const uploadPhoto = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, photoDir);
		},
		filename(req, file, cb) {
			const ext = Helper.getExt(file.originalname);
			const nameWithoutExt = Helper.createAlias(Helper.getFileName(file.originalname, true));
			const fileName = `${nameWithoutExt}-${uuidv4()}${ext}`;
			cb(null, fileName);
		},
		fileSize: (process.env.MAX_PHOTO_SIZE || 10) * 1024 * 1024 // 10MB limit
	})
});

const uploadFile = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, fileDir);
		},
		filename(req, file, cb) {
			const ext = Helper.getExt(file.originalname);
			const nameWithoutExt = Helper.createAlias(Helper.getFileName(file.originalname, true));
			const fileName = `${nameWithoutExt}-${uuidv4()}${ext}`;
			cb(null, fileName);
		},
		fileSize: (process.env.MAX_PHOTO_SIZE || 10) * 1024 * 1024 // 10MB limit
	})
});

router.post('/photo', uploadPhoto.single('photo'), UploadController.uploadPhoto);
router.post('/file', uploadFile.single('file'), UploadController.uploadFile);

module.exports = router;
