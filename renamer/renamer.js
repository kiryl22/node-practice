var fs = require('fs');
var argv = require('optimist').argv;
var util = require('util');

(function Main(argv) {
	//var dir = argv.d ? argv.d : __dirname;
	var oldValue = argv.f;
	var newValue = argv.r;
	var dir = argv.d;
	process([dir], oldValue, newValue);
})(argv);

function process (dirs, f, r) {
		dirs.forEach(function (dir, i, array) {
			var result = readDirectorySync(dir)
			rename(dir,result.fileNames,f,r);
			process(result.dirs, f, r);		
	});
}

function readDirectorySync(rootDir) { 
	var items = fs.readdirSync(rootDir);
    var dirs = [];
	var files = [];
	for(var i = 0,len=items.length; i < len; i++) {
		var item = items[i];
		if (item[0] !== '.') { 
			var path = rootDir + '/' + item;
			var stat = fs.statSync(path);
					
			if (stat.isDirectory()) { 
				dirs.push(path);				
			}
			else {
				files.push(item);
			}
		}		
	}
	return {dirs: dirs, fileNames:files };	
}

function rename(path, files, oldValue, newValue) {
	files.forEach(function(oldFilename){
		if(oldFilename.indexOf(oldValue) > -1){
			var newFileName = oldFilename.replace(oldValue, newValue);
			fs.rename(util.format('%s/%s', path, oldFilename), util.format('%s/%s', path, newFileName), function(err){
				if (err) throw err;
				console.log(util.format('renamed: %s/%s', path, newFileName));
				
			})
		}
	});	
}

