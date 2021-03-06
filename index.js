'use strict';
var fs = require('fs');
var pify = require('pify');
var Promise = require('pinkie-promise');
var path = require('path');
var globby = require('globby');

function doesExist(file) {
	try {
		fs.statSync(file);
		return true;
	} catch (err) {
		return !(err && err.code === 'ENOENT');
	}
}

function execute(file, replace) {
	var reg = /^\./g;
	var match = reg.test(replace);
	var newFile = match ? path.basename(file, path.extname(file)) + replace : replace;
	newFile = path.join(path.dirname(file), newFile);
	var fileExists = doesExist(newFile);

	if (fileExists) {
		return Promise.reject(new Error('file already exists'));
	}

	if (file.length === 0 || replace.length === 0) {
		return Promise.reject(new Error('file or replace name is required'));
	}

	return pify(fs.rename)(file, newFile);
}

module.exports = function (args) {
	var replace = args[args.length - 1];

	args.splice(-1, 1);

	globby(args).then(res => {
		if (res.length === 0) {
			console.log('no file found');
			return;
		}

		res.map(el => {
			execute(el, replace);
		});
	}).catch(err => {
		console.log(err);
	});
};
