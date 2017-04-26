GLOBAL.JSComet = require('./libs/jscomet.js')['default'];

console.read = function(){	
	return new Promise((resolve)=>{
		var stdin = process.openStdin();
		stdin.addListener("data", function(d) {
			stdin.pause();
			resolve(d.toString());
		});
	});
}

import Program from './Program.js';

Program.main(process.argv.slice(2));

