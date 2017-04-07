var fs = require("fs");
var path = require('path');var fs = require("fs");

function ClassTemplate(){
	var ensureDirectoryExistence = function(filePath) {
	  var dirname = path.dirname(filePath);
	  if (fs.existsSync(dirname)) {
		return true;
	  }
	  ensureDirectoryExistence(dirname);
	  fs.mkdirSync(dirname);
	};
	
	this.add = function(solutionPath, projectName, className, extraCommand, baseName){
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
		var dirname = path.dirname(solutionPath);
		project = JSON.parse(JSON.stringify(project));
		project.Source = path.resolve(dirname, project.Source);
		project.Bin = path.resolve(dirname, project.Bin);
		
		var fileName = path.join(project.Source, className + ".js");
		className = path.parse(fileName).name;

		if (fs.existsSync(fileName)) {
			console.error('File "' + fileName + '" already exists');
			return null;
		}
		
		var templateName = "class.js";
		if(extraCommand == "singleton"){
			templateName = "class_singleton.js";
		}else if(extraCommand == "extended"){
			templateName = "class_extended.js";
		}
		
		var templateFile = path.join(__dirname, "./files/", templateName);
		var template = fs.readFileSync(templateFile, 'utf8');

		template = template.split("{BaseName}").join(baseName || "").split("{ClassName}").join(className);
		ensureDirectoryExistence(fileName);
		fs.writeFileSync(fileName, template, { flags: 'w' }, 'utf8');
	}
}

module.exports = { 
	'default': new ClassTemplate()
};