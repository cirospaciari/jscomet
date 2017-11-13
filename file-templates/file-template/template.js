var fs = require("fs");
var path = require('path');
var glob = require('glob');

function ClassTemplate(){
	var ensureDirectoryExistence = function(filePath) {
	  var dirname = path.dirname(filePath);
	  if (fs.existsSync(dirname)) {
		return true;
	  }
	  ensureDirectoryExistence(dirname);
	  fs.mkdirSync(dirname);
	};
	
	var copyFileSync = function(srcFile, destFile) {
	  var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
	  BUF_LENGTH = 64 * 1024;
	  buff = new Buffer(BUF_LENGTH);
	  fdr = fs.openSync(srcFile, 'r');
	  fdw = fs.openSync(destFile, 'w');
	  bytesRead = 1;
	  pos = 0;
	  while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, buff, 0, bytesRead);
		pos += bytesRead;
	  }
	  fs.closeSync(fdr);
	  return fs.closeSync(fdw);
	};
	
	this.add = function(solutionPath, outputFileName){
		var solution = require(solutionPath);
		var solutionDir = solutionPath.substr(0, solutionPath.length - "solution.json".length);
		var fileName = path.join(solutionDir, "file-templates", outputFileName);
		if (fs.existsSync(fileName)) {
			console.error('Template File "' + fileName + '" already exists');
			return null;
		}
		var filesDir = path.join(__dirname, "./files/");
		var files = glob.sync( path.join(filesDir, "/**/**"));
        for(var i = 0; i < files.length;i++){
            if(fs.lstatSync(files[i]).isFile()){
                var binFile = path.join(fileName, files[i].substr(filesDir.length));
                ensureDirectoryExistence(binFile);
                copyFileSync(files[i], binFile);
            }
        }
	}
}

module.exports = { 
	'default': new ClassTemplate()
};
