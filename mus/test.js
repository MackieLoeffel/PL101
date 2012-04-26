var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

var tests = ["  a4 [ 100  ] ","b  b4[200]"];

fs.readFile('example.txt', 'ascii', function(err, data) {
	tests = data.split('\n');
	tests.splice(-1,1);
});

fs.readFile('mus.peg', 'ascii', function(err, data) {
	console.log(data);

	var parse = wrapExceptions(PEG.buildParser(data).parse);

	var i = 1; 
	tests.forEach(function(test) {
		console.log("Test #" + (i++) + ": " + test + " => " + JSON.stringify(parse(test))); });
});

var wrapExceptions = function(f) {
	return f;
	return function(x) {
		try {
			return f(x);
		}
		catch(err) {
			return undefined;
		}
	};
};
