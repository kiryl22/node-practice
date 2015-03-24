var argv = require('optimist').argv;
var fsmanager = require('./fsmanager');

(function Main(argv) {
	var dir = argv.d ? argv.d : __dirname;
	var oldValue = argv.f;
	var newValue = argv.r;
	var dir = argv.d;
	process([dir], oldValue, newValue);
})(argv);

function process (dirs, f, r) {
		dirs.forEach(function (dir, i, array) {
			var result = fsmanager.readDirectorySync(dir);
			fsmanager.rename(dir,result.fileNames,f,r);
			process(result.dirs, f, r);		
	});
}

