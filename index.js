'use strict';
var fs = require('fs');
var pify = require('pify');
var Promise = require('pinkie-promise');
var path = require('path');
var globby = require('globby');

function execute(file, replace) {
	if (file.length === 0 || replace.length === 0) {
		return Promise.reject(new Error('file or replace name is required'));
	}

	var reg = /^(\.[a-z]+\w)/g;
	var match = reg.test(replace);
	var newFile = match ? path.basename(file, path.extname(file)) + replace : replace;

	if (match) {
		newFile = path.join(path.dirname(file), newFile);
	}

	return pify(fs.rename)(file, newFile);
}

module.exports = function (args, opts) {
	var replace = args[args.length - 1];

	args.splice(-1, 1);
	opts = opts || {};

	if (!opts) {
		return args.map(el => {
			execute(el, replace);
		});
	}

	globby(args).then(res => {
		if (!res) {
			console.log('nothing found');
			return;
		}

		res.map(el => {
			execute(el, replace);
		});
	}).catch(err => {
		console.log(err);
	});
};
