#!/usr/bin/env node
'use strict';
const meow = require('meow');
const rnm = require('./');

const cli = meow({
	help: [
		'Usage',
		' $ rnm <oldpath> <newpath>',
		'',
		'Examples',
		' $ $ rnm *.js .jsx',
		' $ rnm mypath/*.js .jsx',
		' $ rnm mypath/myfile.js mynewfile.js'
	]
});

const input = cli.input;

if (input.length < 2) {
	console.error('Inputs required');
	process.exit(1);
}

rnm(input);
