var endTime = function(time, musexpr) {
	switch(musexpr.tag) {
		case 'note':
		case 'rest':
		       return time + musexpr.dur;
		case 'seq':
			return endTime(endTime(time,musexpr.left), musexpr.right);
		case 'par':
			return Math.max(endTime(time,musexpr.left), endTime(time,musexpr.right));
		case 'repeat':
			return time + musexpr.count * endTime(0, musexpr.section);
		default:
			return undefined;
	}
};

var pitchOffsetTable = { 'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11 }; 

var pitchToNumber = function(pitchStr) {
	return 12 + 12 * parseInt(pitchStr.charAt(1)) + pitchOffsetTable[pitchStr.charAt(0)];
};

var compileT = function(time, musexpr) {
	switch(musexpr.tag) {
		case 'note':
		case 'rest':
			var exprCopy = {tag: musexpr.tag, dur:musexpr.dur}; 
			if(musexpr.tag === 'note') {
				var sign = 0;
				if(musexpr.hasOwnProperty('sign')) {
					sign = musexpr.sign === 'b'?-1:(musexpr.sign==='#'?1:0);
				}
				exprCopy.pitch = pitchToNumber(musexpr.pitch) + sign;
			}
			exprCopy.start = time;
			return [exprCopy];
		case 'seq':
			return compileT(time,musexpr.left).concat(compileT(endTime(time,musexpr.left),musexpr.right));
		case 'par':
			return compileT(time,musexpr.left).concat(compileT(time,musexpr.right));
		case 'repeat':
			var list = [];
			var curTime = time;
			for(var i = 0; i < musexpr.count; i++) {
				list = list.concat(compileT(curTime,musexpr.section));
				curTime = endTime(curTime, musexpr.section);
			}
			return list;
		default:
			return undefined;
	}
};

var compile = function(musexpr) {
	return compileT(0,musexpr);
};

var melody_mus = { tag: 'seq',
	left: { tag:'par',
		left: { tag:'note', pitch: 'a4', dur: 250},
		right: { tag:'note', pitch: 'b4', sign: 'b', dur: 250} },
	right: { tag: 'seq',
		left: { tag: 'rest', dur: 500},
		right: { tag: 'repeat',
			section: { tag: 'note', pitch: 'd4', dur: 500},
			count: 4 } } };
melody_mus ={"tag":"par","left":{"tag":"note","sign":"","pitch":"a3","dur":100},"right":{"tag":"seq","left":{"tag":"note","sign":"","pitch":"c5","dur":222},"right":{"tag":"par","left":{"tag":"note","sign":"","pitch":"c3","dur":100},"right":{"tag":"note","sign":"","pitch":"f7","dur":150}}}};

console.log(melody_mus);
console.log(compile(melody_mus));
