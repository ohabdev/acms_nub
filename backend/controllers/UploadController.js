const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const { uploadFileToS3 } = require('../helpers/uploadFiles');
const apiResponse = require('../helpers/apiResponse');
const Helper = require('../helpers/utility');
const photoDir = 'public/photos/';

const imageResize = async (res, options) => {
	try {
		const width = parseInt(options.width, 10);
		const height = parseInt(options.height, 10);
		const inputFile = fs.existsSync(options.input) ? options.input : path.resolve(options.input);
		const fileName = `${Helper.getFileName(options.input, false)}`;
		const outputFile = path.join(`${photoDir}/${options.type}`, fileName);
		return new Promise((resolve, reject) => {
			sharp(inputFile)
				.resize({ width, height })
				.toFile(outputFile, (err) => {
					if (err) {
						return reject(err);
					}

					return resolve(outputFile);
				});
		});
	} catch (error) {
		return apiResponse.ErrorResponse(res, error);
	}
};

exports.uploadPhoto = async (req, res) => {
	try {
		if (!req.file) {
			return apiResponse.ErrorResponse(res, 'Missing photo file! please select photo');
		}

		const file = req.file;
		const thumbPath = await imageResize(res, {
			type: 'thumb',
			input: file.path,
			width: process.env.PHOTO_THUMB_WIDTH || 250,
			height: process.env.PHOTO_THUMB_HEIGHT || 250
		});

		const mediumPath = await imageResize(res, {
			type: 'medium',
			input: file.path,
			width: process.env.PHOTO_MEDIUM_WIDTH || 600,
			height: process.env.PHOTO_MEDIUM_HEIGHT || 600
		});

		const mediumUrl = await uploadFileToS3(res, mediumPath);
		uploadFileToS3(res, thumbPath);
		uploadFileToS3(res, file.path);
		return apiResponse.successResponseWithData(res, 'Photo uploaded successfully', { uploadPath: mediumUrl.key });
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return apiResponse.ErrorResponse(res, 'Missing file! please select file');
		}

		const file = req.file;
		const uploadFile = await uploadFileToS3(res, file.path);
		return apiResponse.successResponseWithData(res, 'File uploaded successfully', { uploadPath: uploadFile.key });
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};
