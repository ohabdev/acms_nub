const nodemailer = require('nodemailer');
const path = require('path');
const SwigEngine = require('swig').Swig;

const swig = new SwigEngine({ cache: 'memory' });
const viewsPath = path.join(__dirname, '..', 'public', 'emails');
const logger = require('../helpers/logger');

const mailFrom = process.env.MAIL_FROM;
const Mailer = function () {
	this.transport = nodemailer.createTransport({
		service: process.env.MAIL_DRIVER,
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: true,
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD
		}
	});
};

Mailer.prototype.render = function render(template, options) {
	return swig.renderFile(path.join(viewsPath, template), options || {});
};

Mailer.prototype.renderFromString = function renderFromString(str, options) {
	return swig.render(str, {
		locals: options || {}
	});
};

Mailer.prototype.send = async function send(opts) {
	try {
		const options = opts || {};
		return this.transport.sendMail(options);
	} catch (e) {
		logger.error('sendMail mail error', e);
	}
};

Mailer.prototype.sendMail = async function sendMail(template, emails, options) {
	try {
		const newOptions = Object.assign(options, {
			appConfig: {
				siteName: process.env.WEBSITE_NAME,
				supportEmail: process.env.SUPPORT_EMAIL
			}
		});

		const output =
			options.renderFromString && options.renderTemplateContent
				? this.renderFromString(options.renderTemplateContent, newOptions)
				: this.render(template, newOptions);

		const resp = await this.send({
			to: emails,
			from: options.from || mailFrom,
			subject: options.subject,
			html: output
		});

		return resp;
	} catch (e) {
		logger.error('Main sending', e);
		throw e;
	}
};

const mailer = new Mailer();

module.exports = {
	async send(template, emails, options) {
		try {
			await mailer.sendMail(template, emails, options);
		} catch (error) {
			logger.error('Sending email error', error);
		}
	}
};
