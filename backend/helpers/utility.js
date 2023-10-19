const url = require('url');
const mimeTypes = require('mime-types');

exports.randomNumber = function (length) {
	let text = '';
	const possible = '123456789';
	for (let i = 0; i < length; i++) {
		const sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup === i ? '0' : possible.charAt(sup);
	}
	return Number(text);
};

exports.normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
};

exports.makeSlug = (slug) => {
	let newSlug = slug.toLowerCase().replace(/[^\w-]+/g, '-');
	while (newSlug.indexOf('--') !== -1) {
		newSlug = newSlug.replace('--', '-');
	}

	return newSlug;
};

exports.populateDbQuery = (query, options = {}) => {
	const match = {};
	(options.text || []).forEach((k) => {
		if (query[k]) {
			match[k] = { $regex: query[k].trim(), $options: 'i' };
		}
	});

	(options.boolean || []).forEach((k) => {
		if (['false', '0'].indexOf(query[k]) > -1) {
			match[k] = false;
		} else if (query[k]) {
			match[k] = true;
		}
	});

	(options.equal || []).forEach((k) => {
		if (query[k]) {
			match[k] = query[k];
		}
	});

	return match;
};

exports.populateDBSort = (query, defaultSort = 'createdAt', defaultSortType = -1) => {
	const sort = {};
	if (query.sort) {
		sort[query.sort] = ['asc', '1'].indexOf(query.sortType) > -1 ? 1 : -1;
	} else {
		sort[defaultSort] = defaultSortType;
	}

	return sort;
};

exports.randomString = (len, charSetInput) => {
	const charSet = charSetInput || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';
	for (let i = 0; i < len; i++) {
		const randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
};

exports.getExt = (path) => {
	const i = path.lastIndexOf('.');
	return i < 0 ? '' : path.substr(i);
};

exports.createAlias = (str) => {
	if (!str || typeof str !== 'string') {
		return '';
	}
	const replaceBy = '-';
	// eslint-disable-next-line no-useless-escape
	return str.toLowerCase().replace(/[^a-zA-Z0-9\.]/g, replaceBy);
};

exports.getFileName = (fullPath, removeExtension) => {
	// eslint-disable-next-line no-useless-escape
	const name = fullPath.replace(/^.*[\\\/]/, '');
	return removeExtension ? name.replace(/\.[^/.]+$/, '') : name;
};

exports.getPublicFileUrl = (filePath) => {
	if (!filePath || exports.isUrl(filePath)) {
		return filePath;
	}
	const newPath = filePath.indexOf('public/') === 0 ? filePath.replace('public/', '') : filePath;
	return url.resolve(process.env.API_BASE_URL, newPath);
};

exports.isUrl = (str) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	return regex.test(str);
};

exports.getContentType = (fileExtension) => {
	return mimeTypes.contentType(fileExtension);
};

exports.generateSlug = (inputText) => {
	const regex = /[^a-zA-Z0-9\s]/g;
	const cleanedSentence = inputText.replace(regex, '');
	const lowercaseText = cleanedSentence.toLowerCase();
	const words = lowercaseText.split(' ');
	const camelCaseWords = words.map((word, index) => {
		if (index === 0) {
			return word;
		}
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	const slug = camelCaseWords.join('');
	return slug;
};
