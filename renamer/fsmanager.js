var fs = require('fs');
var util = require('util')

function fsmanager () {
	this.readDirectorySync = function (rootDir) { 
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

	this.rename = function (path, files, oldValue, newValue) {
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
}

module.exports = new fsmanager();
