var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

var tests = [ {code: "a", result: "a"},
	{code: "(a)", result: ["a"]},
    	{code: "(a b c)", result: ["a", "b", "c"] },
	{code: "()", result: undefined},
	{code: "(+ 1 (* x 3))", result: ["+", "1", ["*", "x", "3"]]},
	{code: "(* n (factorial (- n 1)))", result: ["*", "n", ["factorial", ["-", "n", "1"]]]},
	{code: "(\t+   1   (*   x  3   )  )", result: ["+", "1", ["*", "x", "3"]]},
	{code: "(if (= n 0) 1 \n\t(* n x))", result: ["if",["=","n","0"],"1",["*","n","x"]]},
	{code: "'a", result: ["quote", "a"]},
	{code: "(a b \n;; comment...\n)", result:["a","b"]}];

fs.readFile('scheem.peg', 'ascii', function(err, data) {
	console.log(data);

	var parse = wrapExceptions(PEG.buildParser(data).parse);

	var i = 1; 
	tests.forEach(function(test) {
		console.log("Test #" + (i++) + ": " + test.code + " => " + JSON.stringify(test.result));
		assert.deepEqual(parse(test.code), test.result);
	});
});

var wrapExceptions = function(f) {
	return function(x) {
		try {
			return f(x);
		}
		catch(err) {
			return undefined;
		}
	};
};
