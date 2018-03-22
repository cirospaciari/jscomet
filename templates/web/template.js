var asyncToGen = require('async-to-gen');
var fs = require("fs");
var path = require('path');
var glob = require('glob');

function WebTemplate(){
	
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

	
	this.build = function(solutionPath, projectName){
		try{
			//custom build
			//return success
			//return Promise for async
			var solution = require(solutionPath);
			var project = null;
			for(var i in solution.Projects){
				if(solution.Projects[i].Name == projectName){
					project = solution.Projects[i];
					break;
				}
			}
			if(project == null){
				console.error(projectName + " project does not exist");
				return false;
			}
			console.log("Building: "+project.Name + "...");
			var dirname = path.dirname(solutionPath);
			project = JSON.parse(JSON.stringify(project));
			project.Source = path.resolve(dirname, project.Source);
			project.Bin = path.resolve(dirname, project.Bin);
			
			var ignoreList = [];
			for(var j  = 0; j < project.IgnorePathsOnTranslate.length;j++){
				ignoreList.push(path.join(project.Source, project.IgnorePathsOnTranslate[j], "/**/**"));
			}
			var files = glob.sync(path.join(project.Source, "/**/**"), { "ignore": ignoreList });
			var options = {};
			var projectOptions = project.Options || solution.Options;
			for(var i in projectOptions){
				options[i] = projectOptions[i];
			}
			var translateAsync = false;
			if (options["translateAsyncFunctions"]) {
				options["translateAsyncFunctions"] = false;
				translateAsync = true;
			}
			for(var i = 0; i < files.length;i++){
				var extension = (path.extname(files[i]) || "").toLowerCase();
				if(extension == ".js"){
					try{
						var text = fs.readFileSync(files[i]).toString();
						text = JSComet.translate(text, options);
						if(translateAsync){
							text = asyncToGen(text).toString();
						}
						var binFile = path.join(project.Bin, files[i].substr(project.Source.length));
						ensureDirectoryExistence(binFile);
				
						fs.writeFileSync(binFile, text,{ flags: 'w' }, 'utf8');
					}catch(ex){
						console.error(files[i]+": "+ex);
						return false;
					}
				}else{
					if(fs.lstatSync(files[i]).isFile()){
						var binFile = path.join(project.Bin, files[i].substr(project.Source.length));
						ensureDirectoryExistence(binFile);
						copyFileSync(files[i], binFile);
					}
				}
			}
			
			for(var j  = 0; j < project.IgnorePathsOnTranslate.length;j++){
				var files = glob.sync(path.join(project.Source, project.IgnorePathsOnTranslate[j], "/**/**"));
				for(var i = 0; i < files.length;i++){
					if(fs.lstatSync(files[i]).isFile()){
						var binFile = path.join(project.Bin, files[i].substr(project.Source.length));
						ensureDirectoryExistence(binFile);
						copyFileSync(files[i], binFile);
					}
				}
			}
			console.log(project.Name + " successfully built");
			return true;
		}catch(ex){
			console.log(ex);
			return false;
		}
	}
	
	this.run = function(solutionPath, projectName){
		
		var solution = require(solutionPath);
		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
				break;
			}
		}
		if(project == null){
			console.error(projectName + " project does not exist");
			return false;
		}
		console.log("Starting: "+project.Name + "...");
		var dirname = path.dirname(solutionPath);
		var mainFile = path.resolve(dirname, project.Bin, project.MainFile);
		
		//custom run
		var childProcess = require('child_process');

		console.log(project.Name, "started\n");
		var node = childProcess.spawn('node', [mainFile],  {
			stdio: [0,1,2]
		});

		node.on('close', function (code) {
			setTimeout(function(){
				console.log(project.Name + ' process exited with exit code ' + code);
			},10);
		});
	}
	
	
	this.create = function(solutionPath, projectName){
		//custom create
		//return project settings
		//return Promise for async
		try{
			var dirname = path.dirname(solutionPath);
			var projectPath = path.join(dirname , projectName);
			if (fs.existsSync(projectPath)) {
				console.error('Directory "' + projectName + '" already exists');
				return null;
			}
			
			ensureDirectoryExistence(projectPath);
			
			var project = require('./project.json');
			
			for(var i in project){
				if(typeof project[i]  == "string"){
					project[i] = project[i].replace("{ProjectName}", projectName);
				}
			}
			
			var mainName = path.join(dirname, project.Source, project.MainFile);
			
			ensureDirectoryExistence(mainName);
			
			var templateSource = path.join(__dirname, "./files/");
			var files = glob.sync(path.join(templateSource, "/**/**"));
			for(var i = 0; i < files.length;i++){
				if(fs.lstatSync(files[i]).isFile()){
					var fileName = files[i].substr(templateSource.length);
					var templateFile = "";
					
					if(fileName.indexOf("$node_modules/") == 0){
						templateFile = path.join(project.Source, fileName.substring(1));
					}else{
						templateFile = path.join(project.Source, fileName);
					}
					ensureDirectoryExistence(templateFile);
					copyFileSync(files[i], templateFile);
				}
			}
			
			var coreName = path.join(process.env.JSCOMET_PATH, "core/jscomet.withouttranslate.min.js");
			var libName = path.join(dirname, project.Source, "libs/jscomet.js");
			
			ensureDirectoryExistence(libName);
			copyFileSync(coreName, libName);
            
            console.log("Please run 'npm install' command in '"  + project.Source + "' folder to install all dependencies"); 
			return project;
		}catch(ex){
			console.error(ex);
			console.error('Failed to create project. Please enter a valid name or verify the necessary permissions');
			return null;
		}
	}
	
	this.publish = function(solutionPath, projectName, outDirectory){
		//custom publish
		//return false to not execute default publish
		//return Promise for async
		return true;
	}
}
module.exports = { 
	'default': new WebTemplate()
};
