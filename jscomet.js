#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var path = require('path');
var JSComet = require("./core/jscomet.js")["default"];
var ncp = require('ncp').ncp; 
ncp.limit = 16;
							
global.JSComet = JSComet;

var solutionDirectory = "./";
var solutionPath = "./solution.json";

function getAsync(result){
	if(result instanceof Promise)
		return result;
	return new Promise(function(resolve){
		resolve(result);
	});
}
function create(projectType, projectName){
	if(projectType == "solution"){
		if(fs.existsSync(solutionPath)) {
			console.error("Solution already exists in this directory");
			return false;
		}
		var solutionJSON = fs.readFileSync(path.join(process.env.JSCOMET_PATH, "./default_solution.json"), 'utf8');
	
		fs.writeFileSync(solutionPath, solutionJSON, { flags: 'w' }, 'utf8');
		console.log("The solution has been successfully created!")
		return true;
		
	}else if(projectType && projectName){
		if(!fs.existsSync(solutionPath)) {
			console.error("You must create a solution to add a project");
			return false;
		}
		var solution = null;
		try{
			solution = require(solutionPath);
		}catch(ex){
			console.error("Failed to load solution");
			return false;
		}
		if(fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" already exists');
			return false;
		}

		try{
			
			var template = require(path.join(process.env.JSCOMET_PATH, "templates", projectType, "template.js"))["default"];
			var args = [solutionPath, projectName];
			for(var i = 2; i < arguments.length; i++){
				args.push(arguments[i]);
			}
			
			var promise = getAsync(template.create.apply(template, args));
			promise.then(function(project){
				try{
					if(project != null){
						solution.Projects.push(project);
						var solutionJSON = JSON.stringify(solution, null, 4);
						fs.writeFileSync(solutionPath, solutionJSON, { flags: 'w' }, 'utf8');
						console.log("Project successfully created!");
					}
				}catch(ex){
					console.error("Failed to save project in solution");
				}
			});
			
		}catch(ex){
			if(ex.code === 'MODULE_NOT_FOUND'){
				console.error("Project type not found");
			}else
				console.error(ex);
		}
		
	}else{
		console.error("you must enter the project type and a project name");
		return false;
	}
}
function build(projectName){
	
	if(projectName){
		if(!fs.existsSync(solutionPath)) {
			console.error("You must create a solution to build a project");
			return false;
		}
		var solution = null;
		try{
			solution = require(solutionPath);
		}catch(ex){
			console.error("Failed to load solution");
			return false;
		}
		if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
				break;
			}
		}
		
		if(!project){
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		
		if(!clean(projectName))
			return false;
	
		
		var buildPromise = new Promise(function(resolve){
			function buildProject(){
				try{
					var beforeBuild = path.join(solutionDirectory, projectName, 'before-build.js');
					if(fs.existsSync(beforeBuild)){
						require(beforeBuild);
					}
					
					var template = require(path.join(process.env.JSCOMET_PATH, "templates", project.Type, "template.js"))["default"];
					
					var args = [solutionPath, projectName];
					
					for(var i = 2; i < arguments.length; i++){
						args.push(arguments[i]);
					}
					
					var promise = getAsync(template.build.apply(template, args));
					promise.then(function(success){
						try{
							if(!success){
								console.error("Failed to build project");
							}else{
								var afterBuild = path.join(solutionDirectory, projectName, 'after-build.js');
								if(fs.existsSync(afterBuild))
									require(afterBuild);
								
							}
							resolve(success);
						}catch(ex){
							
							console.error("Failed to build project");
							resolve(false);
						}
					}).catch(function(){
						resolve(false);
					});
				}catch(ex){
					if(ex.code === 'MODULE_NOT_FOUND'){
						console.error("Project type not found");
					}else
						console.error(ex);
					resolve(false);
					return false;
				}
			}
			
			function nextReference(){
				
				if(project.References){
				
					var reference = project.References.shift();
					if(reference){
						var referenceProject = null;
						for(var i in solution.Projects){
							if(solution.Projects[i].Name == reference.Project){
								referenceProject = solution.Projects[i];
								break;
							}
						}
						
						if(!referenceProject){
							console.error('Reference "' + reference.Project + '" does not exist');
							return false;
						}
						
						getAsync(build(referenceProject.Name)).then(function(success){
							if(success){
								var outPath = path.join(solutionDirectory, project.Source, reference.Out);
								ensureDirectoryExistence(outPath);
								ncp(path.join(solutionDirectory, referenceProject.Bin), 
									outPath, 
									function (err) {
									 if (err) {
									   console.error(err);
									   resolve(false);
									   return;
									 }
									 
									 setTimeout(function(){
										var subLibs = path.join(solutionDirectory, project.Source,	reference.Out, "./libs");
										deleteFolderRecursive(subLibs);
									 
										nextReference();
									 },10);
								});

							}else{
								console.error("Failed to build project");
								resolve(false);
							}
						}).catch(function(){
							console.error("Failed to build project");
							resolve(false);
						});
					}else
						buildProject();
				}else
					buildProject();
			}
			nextReference();
		});
		
		return buildPromise;
		
	}else{
		console.error("you must enter the project name");
		return false;
	}
}
function clean(projectName){
	
	if(!fs.existsSync(solutionPath)) {
		console.error("You must create a solution to clean");
		return false;
	}
	var solution = null;
	try{
		solution = require(solutionPath);
	}catch(ex){
		console.error("Failed to load solution");
		return false;
	}
		
	if(projectName){
		if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
			}
		}
		
		if(!project){
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		console.log("Cleaning project " + projectName + "...");
		deleteFolderRecursive(project.Bin);
		console.log(project.Name + " was clear");
		return true;
	}else{
		
		console.log("Cleaning solution...");
		for(var i = 0; i < solution.Projects.length; i++){
			project = solution.Projects[i];
			deleteFolderRecursive(project.Bin);
		}
		console.log("solution was clear");
		return true;
	}
}
function reference(method, projectName, projectReference){
	if(!projectName || !projectReference){
		console.log("Enter the project name and the reference name");
		return false;
	}
	
	if(!fs.existsSync(solutionPath)) {
		console.error("You must create a solution to add/remove a reference");
		return false;
	}
	
	var solution = null;
	try{
		solution = require(solutionPath);
	}catch(ex){
		console.error("Failed to load solution");
		return false;
	}
	if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
		console.error('Project "' + projectName + '" does not exist');
		return false;
	}
	var project = null;
	for(var i in solution.Projects){
		if(solution.Projects[i].Name == projectName){
			project = solution.Projects[i];
		}
	}
	
	if(!project){
		console.error('Project "' + projectName + '" does not exist');
		return false;
	}
	
	if(!fs.existsSync(path.join(solutionDirectory, projectReference))) {
		console.error('Project "' + projectReference + '" does not exist');
		return false;
	}
	var reference = null;
	for(var i in solution.Projects){
		if(solution.Projects[i].Name == projectReference){
			reference = solution.Projects[i];
		}
	}
	
	if(!reference){
		console.error('Project "' + projectReference + '" does not exist');
		return false;
	}
	
	
	switch(method){
		case "add":
				
			if(projectName == projectReference){
				console.log("You can not reference a project himself... duh!");
				return false;
			}
			if(project.References)
			{
				for(var i in project.References){
					if(project.References[i].Project == reference.Name){
						console.log("Reference added successfully!");
						return true;
					}
				}
				
			}
			if(reference.References)
			{
				for(var i in reference.References){
					if(reference.References[i].Project == project.Name){
						console.log("You can not perform cyclical references");
						return false;
					}
				}
				
			}
			project.References = project.References || [];
			project.References.push({
				Project: reference.Name,
				Out: './libs/'
			});
			try{
				var solutionJSON = JSON.stringify(solution, null, 4);
				fs.writeFileSync(solutionPath, solutionJSON, { flags: 'w' }, 'utf8');
				console.log("Reference added successfully!");
				return true;
			}catch(ex){
				console.error("Failed to save project in solution");
				return false;
			}
		break;
		case "remove":
			
			var find = false;
			var newReferences = [];
			
			if(project.References)
			{
				for(var i in project.References){
					if(project.References[i].Project == reference.Name){
						find = true;
					}else{
						newReferences[i].push(project.References[i]);
					}
				}
			}
			if(!find)
			{
				console.log("Reference removed successfully!");
				return true;
			}
			project.References = newReferences;
			
			try{
				var solutionJSON = JSON.stringify(solution, null, 4);
				fs.writeFileSync(solutionPath, solutionJSON, { flags: 'w' }, 'utf8');
				console.log("Reference removed successfully!");
				return true;
			}catch(ex){
				console.error("Failed to save project in solution");
				return false;
			}
			
		break;
		default:
			console.log("Invalid method. Available options: add, remove");
			return false;
	}
}
function remove(projectName){
	if(!projectName){
		console.error("you must enter the project name");
		return false;
	}
	if(!fs.existsSync(solutionPath)) {
		console.error("You must create a solution to build a project");
		return false;
	}
	var solution = null;
	try{
		solution = require(solutionPath);
	}catch(ex){
		console.error("Failed to load solution");
		return false;
	}
	if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
		console.error('Project "' + projectName + '" does not exist');
		return false;
	}
	var project = null;
	var newProjects = [];
	for(var i in solution.Projects){
		if(solution.Projects[i].Name == projectName){
			project = solution.Projects[i];
		}else{
			newProjects.push(solution.Projects[i]);
		}
	}
	if(!project){
		console.error('Project "' + projectName + '" does not exist');
		return false;
	}
	solution.Projects = newProjects;
	try{
		var solutionJSON = JSON.stringify(solution, null, 4);
		fs.writeFileSync(solutionPath, solutionJSON, { flags: 'w' }, 'utf8');
		console.log("The project was removed from the solution, your files must be manually deleted.");
		return true;
	}catch(ex){
		console.error("Failed to save solution");
		return false;
	}
}
function run(projectName){
	if(projectName){
		if(!fs.existsSync(solutionPath)) {
			console.error("You must create a solution to run a project");
			return false;
		}
		var solution = null;
		try{
			solution = require(solutionPath);
		}catch(ex){
			console.error("Failed to load solution");
			return false;
		}
		if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}

		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
			}
		}
		
		if(!project){
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		
		try{
			
			var template = require(path.join(process.env.JSCOMET_PATH, "templates", project.Type, "template.js"))["default"];
			var args = [solutionPath, projectName];
			for(var i = 2; i < arguments.length; i++){
				args.push(arguments[i]);
			}
			
			getAsync(build(projectName)).then(function(success){
				if(success){
					var promise = getAsync(template.run.apply(template, args));
				}
			});
			
			
		}catch(ex){

			if(ex.code === 'MODULE_NOT_FOUND'){
				console.error("Project type not found");
			}else
				console.error(ex);
		}
		
	}else{
		console.error("you must enter the project name");
		return false;
	}
}
function publish(projectName, outDirectory){
	if(projectName && outDirectory){
		if(!fs.existsSync(solutionPath)) {
			console.error("You must create a solution to publish a project");
			return false;
		}
		var solution = null;
		try{
			solution = require(solutionPath);
		}catch(ex){
			console.error("Failed to load solution");
			return false;
		}
		if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}

		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
			}
		}
		
		if(!project){
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		
		try{
			
			var template = require(path.join(process.env.JSCOMET_PATH, "templates", project.Type, "template.js"))["default"];
			var args = [solutionPath, projectName];
			for(var i = 2; i < arguments.length; i++){
				args.push(arguments[i]);
			}
			
			getAsync(build(projectName)).then(function(success){
				if(success){
					console.log("Publishing: " + project.Name + "...");
					var promise = getAsync(template.publish.apply(template, args));
					promise.then(function(useDefaultPush){
						if(!useDefaultPush){
							return;
						}
						outDirectory = path.resolve(solutionDirectory, outDirectory);
						
						ensureDirectoryExistence(outDirectory);
						deleteFolderRecursive(outDirectory);
						ensureDirectoryExistence(outDirectory);
						
						ncp(path.join(solutionDirectory, project.Bin), 
							outDirectory, 
							function (err) {
							if (err) {
							  console.error(err);
							  return;
							}
							console.error("Project was successfully published!");
						});
					}).catch(function(){
						console.error("Failed to publish project");
					});
				}
			});
			
			
		}catch(ex){
			if(ex.code === 'MODULE_NOT_FOUND'){
				console.error("Project type not found");
			}else
				console.error(ex);
		}
		
	}else{
		console.error("you must enter the project name and out directory");
		return false;
	}
	
}

function customCommandOrMenu(customCommand, args){
	
	projectName = args[0];
	
	if(!projectName){
		printMenu();
		return false;
	}
	
	if(!fs.existsSync(solutionPath)) {
		printMenu();
		return false;
	}
	
	var solution = null;
	try{
		solution = require(solutionPath);
	}catch(ex){
		console.error("Failed to load solution");
		return false;
	}
	if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
		printMenu();
		return false;
	}
	var project = null;
	for(var i in solution.Projects){
		if(solution.Projects[i].Name == projectName){
			project = solution.Projects[i];
			break;
		}
	}
	
	if(!project){
		printMenu();
		return false;
	}
	
	var templatePath = path.join(process.env.JSCOMET_PATH, "templates", project.Type, "template.js");
	if(!fs.existsSync(solutionPath)) {
		printMenu();
		return false;
	}
	var template = null;
	try{
		template = require(templatePath)["default"];
	}catch(ex){}
	
	if(!template || !template[customCommand]){
		printMenu();
		return false;
	}
	
	try{
		args = [solutionPath, projectName];
		for(var i = 2; i < arguments.length; i++){
			args.push(arguments[i]);
		}
		return template[customCommand].apply(template, args);
	}catch(ex){
		console.error("Failed to execute command");
		return false;
	}
}
function printMenu(){
	console.log("Options:");
	console.log("\tversion", 								"\t\t\t\t", "show JSComet version");
	console.log("\tclean", 									"\t\t\t\t\t", "clean all projects");
	console.log("\tclean %PROJECT_NAME%", 					"\t\t\t", "clean a project");
	console.log("\tbuild %PROJECT_NAME%", 					"\t\t\t", "build a project");
	console.log("\tcreate solution", 						"\t\t\t", "create a empty solution file");
	console.log("\tcreate %PROJECT_TYPE% %PROJECT_NAME%", 	"\t", "create a project");
	console.log("\tremove %PROJECT_NAME%", 					"\t\t\t", "remove a project");
	console.log("\trun %PROJECT_NAME%",  					"\t\t\t",  "run a project"); 
	console.log("\tpublish %PROJECT_NAME% %OUT_DIRECTORY%", " ", "publish a project to folder");
	console.log("");
	console.log("\treference add %PROJECT_NAME% %REFERENCE_PROJECT_NAME%",		"\t\t", "add project reference");
	console.log("\treference remove %PROJECT_NAME% %REFERENCE_PROJECT_NAME%",		"\t", "remove project reference");
	console.log("\tadd %FILE_TEMPLATE% %PROJECT_NAME% %FILE_PATH%",  "\t\t\t",  "add a file"); 
	console.log("\t Default Options:");
	console.log("\t  add html MyProject myHTMLFile"); 
	console.log("\t  add xml MyProject myXMLFile"); 
	console.log("\t  add js MyProject myJSFile"); 
	console.log("\t  add css MyProject myJSFile"); 
	console.log("\t  add class MyProject models\\myModelClass"); 
	console.log("\t  add class MyProject models\\myModelClass extended myModelBase"); 
	console.log("\t  add class MyProject models\\myModelClass singleton"); 
	console.log("\t  add controller MyProject myControllerClass"); 
	console.log("\t  add view MyProject user\\myView"); 
	console.log("\t  add layout MyProject myLayout"); 
}

function add(templateName, projectName, fileName){
	if(templateName && projectName && fileName){
		if(!fs.existsSync(solutionPath)) {
			console.error("You must create a solution to add a file");
			return false;
		}
		var solution = null;
		try{
			solution = require(solutionPath);
		}catch(ex){
			console.error("Failed to load solution");
			return false;
		}
		if(!fs.existsSync(path.join(solutionDirectory, projectName))) {
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
	
		var project = null;
		for(var i in solution.Projects){
			if(solution.Projects[i].Name == projectName){
				project = solution.Projects[i];
				break;
			}
		}
		
		if(!project){
			console.error('Project "' + projectName + '" does not exist');
			return false;
		}
		
		try{
			
			var templateFilePath = path.join(process.env.JSCOMET_PATH, "templates", project.Type, "file-templates", templateName, "template.js");
			if(!fs.existsSync(path.join(templateFilePath))) {
				templateFilePath = path.join(process.env.JSCOMET_PATH, "file-templates", templateName, "template.js");
			}
			if(!fs.existsSync(path.join(templateFilePath))) {
				console.error('Template "' + templateFilePath + '" does not exist');
				return false;
			}
			var fileTemplate = require(templateFilePath)["default"];
			
			//var template = require()["default"];
			var args = [solutionPath, projectName];
			for(var i = 2; i < arguments.length; i++){
				args.push(arguments[i]);
			}
			
			return fileTemplate.add.apply(fileTemplate, args);
		}catch(ex){
			console.log(ex);
			console.error("Failed to add file template");
		}
	
	}else{
		console.error("you must enter the template, project name and file name");
		return false;
	}
}

function main(){
	var args = process.argv.slice(1);
	solutionDirectory = path.resolve("./");
	process.env.JSCOMET_PATH = __dirname;
	solutionPath = path.join(solutionDirectory, "solution.json");
	switch(args[1]){
		case "v":
		case "version":
			console.log("v1.0.18");
		break;
		case "build":
			build.apply(this, args.slice(2));
		break;
		case "clean":
			clean.apply(this, args.slice(2));
		break;
		case "create":
			create.apply(this, args.slice(2));
		break;
		case "run":
			run.apply(this, args.slice(2));
		break;
		case "remove":
			remove.apply(this, args.slice(2));
		break;
		case "reference":
			reference.apply(this, args.slice(2));
		break;
		case "publish":
			publish.apply(this, args.slice(2));
		break;
		case "add":
			add.apply(this, args.slice(2));
		break;
		default:
			customCommandOrMenu(args[1], args.slice(2));
		break;
	}
	
}

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
var ensureDirectoryExistence = function(filePath) {
	  var dirname = path.dirname(filePath);
	  if (fs.existsSync(dirname)) {
		return true;
	  }
	  ensureDirectoryExistence(dirname);
	  fs.mkdirSync(dirname);
};
	
main();