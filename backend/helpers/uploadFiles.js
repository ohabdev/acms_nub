const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const apiResponse = require('./apiResponse');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const logger = require('../helpers/logger');
const Helper = require('./utility');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

async function removeLocalFile(res, filePath) {
	try {
		if (filePath && fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	} catch (e) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
}

const uploadFileToS3 = async (res, filePathTemp) => {
	try {
		let filePath;
		if (fs.existsSync(filePathTemp)) {
			filePath = filePathTemp;
		} else if (fs.existsSync(path.resolve(filePathTemp))) {
			filePath = path.resolve(filePathTemp);
		} else {
			throw new Error(`File path ${filePath} does not exist!`);
		}
		const uploadKey = filePath.replace('public/', '');
		const fileExtension = path.extname(filePath);
		const params = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: uploadKey,
			Body: fs.createReadStream(filePath),
			ContentType: Helper.getContentType(fileExtension)
		};
		const uploadResult = await new Promise((resolve, reject) =>
			s3.putObject(params, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve({
					key: uploadKey,
					bucket: process.env.AWS_S3_BUCKET,
					url: this.getUrl(uploadKey)
				});
			})
		);
		removeLocalFile(res, filePath);
		return uploadResult;
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

const downloadFileFromS3ByKey = async (bucketKey) => {
	try {
		const options = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: bucketKey
		};
		return s3.getObject(options).createReadStream();
	} catch (error) {
		logger.error(error);
		throw error;
	}
};

exports.getUrl = (key) => {
	if (process.env.AWS_S3_CLOUDFRONT) {
		return `${process.env.AWS_S3_CLOUDFRONT}/${key}`;
	}
	return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
};

module.exports = {
	removeLocalFile,
	uploadFileToS3,
	downloadFileFromS3ByKey
};
