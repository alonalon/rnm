#!/usr/bin/env node
'use strict';
const meow = require('meow');
const rnm = require('./');

const cli = meow(`
	Usage
	 $ rnm <oldpath> <newpath>

	Options
	  -w, --wildcard

	Examples
	  $ $ rnm *.js .jsx --wildcard
	  $ rnm mypath/*.js .jsx -wildcard
	  $ rnm mypath/myfile.js mynewfile.js
`, {
	alias: {
		w: 'wildcard'
	}
});

const input = cli.input;

if (input.length < 2) {
	console.error('Inputs required');
	process.exit(1);
}

rnm(input, cli.flags);
