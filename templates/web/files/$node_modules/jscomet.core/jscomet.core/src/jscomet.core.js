
import * as Bliss from "bliss";
import * as fs from "fs";
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
import * as session from 'express-session';

module JSCometWeb{
	export class Controller{
		title: string = "";
		layout: string = "layout";
		viewRenderer: ViewRenderer;
		
		view(){
			return this.view(null, null);
		}
		
		view(model){
			return this.view(null, model);
		}

		view(viewName: string, model){
			return { 
				isView: true,
				viewName: viewName,
				model: model
			};
		}
		
		stream(stream){
			return { 
				result: stream, 
				isStream: true
			};
		}
		buffer(buffer, status, contentType){
			status = status || 200;
			contentType = contentType || 'application/octet-stream';
			return { 
				result: buffer,
				status: status,
				contentType: contentType
			};
		}
		file(path: string){
			return { 
				result: path, 
				isFile: true
			};
		}
		file(path: string, filename: string){
			return { 
				result: path, 
				filename: filename,
				isFile: true
			};
		}
		redirect(url, status){
			status = status || 302;
			return { 
				result: url, 
				status: status
			};
		}
		
		json(object, status){
			status = status || 200;
			return { 
				result: JSON.stringify(object), 
				status: status, 
				contentType: 'application/json'  
			};
		}
		
		text(result, status){
			status = status || 200;
			return { 
				result: result, 
				status: status, 
				contentType: 'text/plain'
			};
		}
		
		error(result, status){
			status = status || 500;
			
			return {
				result: result,
				status: status,
				contentType: 'error'
			};
		}
		
		html(result, status, contentType){
			status = status || 200;
			contentType = contentType || 'text/html';
			return { 
				result: result, 
				status: status, 
				contentType: contentType
			};
		}
		render(model): string{
			if(!this.viewEngine)
				return null;
			
			return this.viewEngine.render(model);
		}
		
		render(viewName: string, model): string{
			if(!this.viewRenderer)
				return null;
			
			return this.viewRenderer.render(viewName, model);
		}
		
		partial(model): string{
			if(!this.viewRenderer)
				return null;
			
			return this.viewRenderer.partial(model);
		}
		
		partial(viewName: string, model): string{
			if(!this.viewRenderer)
				return null;
			
			return this.viewRenderer.partial(viewName, model);
		}
		
		async(executor: Function): Promise{
			var self = this;
			return new Promise((resolve, reject) => {
				try{
					executor.call(self, resolve, reject);
				}catch(ex){
					reject(ex);
				}
			});
		}
	}


	export class RouteEngine{
		public viewEngine: ViewEngine;
		public appDirectory: string;

		constructor(appDirectory: string, viewEngine: ViewEngine){
			this.viewEngine = viewEngine;
			this.appDirectory = appDirectory;
		}

		public match(request, response): boolean{
			throw "Not implemented";
		}

		public error(error, request, response): void{
			throw "Not implemented";
		}
	}

	export class ViewRenderer{
		controller: Controller;
		controllerName: string;
		actionName: string;
		
		directory: string;
		viewEngine: ViewEngine;
		
		
		constructor(controller: Controller,
					controllerName: string, 
					actionName: string, 
					viewEngine: ViewEngine,
					directory: string){
						
			this.controller = controller;
			this.controllerName = controllerName;
			this.actionName = actionName;
			this.viewEngine = viewEngine;
			this.directory = directory;
		}
		
		render(model) : string {
			return this.render(null, model);
		}
		
		render(viewName: string, model){
			
			var body = this.partial(viewName, model);
			
			var layoutName = controller.layout + ".html";
			var layoutDir =  path.join(this.directory, "/views/" + (this.controllerName || "").toLowerCase() + "/" + layoutName);
			if(!fs.existsSync(layoutDir)){
				layoutDir = path.join(this.directory, "/shared/" + layoutName);
				if(!fs.existsSync(layoutDir)){
					layoutDir = null;
				}
			}
			var html = "";
			
			if(layoutDir)
				html = this.viewEngine.compile(layoutDir, controller.title, body, this);
			else
				html = body;
			
			return html;
		}
		
		partial(model) : string{
			return this.partial(null, model);
		}
		
		partial(viewName: string, model) : string{

			var viewName = (viewName || this.actionName) + ".html";
			var viewDir = path.join(this.directory, "/views/" + (this.controllerName || "").toLowerCase() + "/" + viewName);
			if(!fs.existsSync(viewDir)){
				viewDir = path.join(this.directory, "/shared/" + viewName);
				if(!fs.existsSync(viewDir)){
					throw viewName + " not found.";
				}
			}
			
			return this.viewEngine.compile(viewDir, model, this);
		}
		
	}
	
	export class ViewEngine{
		public compile(fileName: string, ...models): string{
			throw "Not implemented";	
		}
	}

	export class BlissViewEngine extends ViewEngine{

		private static Current: Bliss = new Bliss();

		public compile(fileName: string, ...models): string{
			return BlissViewEngine.Current
								  .compileFile(fileName)
								  .apply(null, models);
		}
	}

	export class MVCRoute{
		name: string;
		url: string;
		controller: string;
		action: string;
		type: string[];

		constructor(name: string, 
					url: string, 
					controller: string, 
					action: string, 
					...type){
			this.name = name;
			this.url = url;
			this.controller = controller;
			this.action = action;
			this.type = type;
		}
	}


	class Enum{
		private _value;
		private _key;

		constructor(key, value){
			if (this.constructor === Enum)
      			throw new TypeError("Cannot construct Abstract instances directly");

			this._value = value;
			this._key = key;
		}

		get value(){
			return this._value;
		}

		get key(){
			return this._key;
		}

		toString(){
			return `${this.key}`;
		}

		toJSON(){
			return JSON.stringify(this.value);
		}
	}

	class Environment extends Enum{
		private static values = {};

		constructor(key: string, value: int){
			super(key, value);

			switch(key){
				case "development":
				case "homologation":
				case "production":
					if(typeof Environment.values[key] != "undefined")
					   throw new TypeError("Cannot instantiate Enum");	
					break;
				default:
					throw new TypeError("Cannot instantiate Enum");
			}
			Environment.values[key] = this;
		}

		static get development(){
			return Environment.values["development"];
		}

		static get homologation(){
			return Environment.values["homologation"];
		}

		static get production(){
			return Environment.values["production"];
		}

		static get keys(){
			return Object.keys(Environment.values);
		}
		
		static get values(){
			var values = [];

			for(var i in Environment.values)
				values.push(Environment.values[i].value);

			return values;
		}

		static fromValue(value: int){
			for(var i in Environment.values)
				if(Environment.values[i].value === value)
					return Environment.values[i];
			return null;
		}

		static fromKey(key: string){
			return Environment.values[key] || null;
		}
	}
	new Environment("development", 0);
	new Environment("homologation", 1);
	new Environment("production", 2);

	export { Environment };

	export class MVCRouteEngine extends RouteEngine{
		private allRoutes = {};

		constructor(appDirectory, viewEngine: ViewEngine){
			super(appDirectory, viewEngine);
		}

		public route(route: MVCRoute){
			this.allRoutes[route.name] = route;
		}

		public load(fileName: string){
			var loadedRoutes = {}
			
			
			if(require.main){
				loadedRoutes = require.main.require(fileName);
			//node js repl e arquivo local
			}else if(__dirname && fileName.indexOf('.') == 0 && require.resolve){
				//sobe um nivel acima contando que JSComet.Core.js sempre estará em /libs/JSComet.Core.js
				fileName = __dirname + '/.' + fileName;
				fileName = require.resolve(fileName);
				loadedRoutes = require(fileName);
			}
			else{
				loadedRoutes = require(fileName);
			}
			
			for(var i in loadedRoutes){
				loadedRoutes[i].name = i;
				this.allRoutes[i] = loadedRoutes[i];
			}
		}

		public error(error, request, response) : void {
			
			error = {
				status: error.status || 500,
				message: error.message || error,
				error: (Environment.fromKey(process.env.NODE_ENV) === Environment.development) ? error : []
			};
			
			var directory = this.appDirectory;
			var errorDir =  path.join(directory, `/views/errors/${error.status}.html`);
			if(!fs.existsSync(errorDir)){
				errorDir = path.join(directory, "/views/errors/500.html");
			}
			var html = this.viewEngine.compile(errorDir, error);
			 
			response.header('Content-Type', 'text/html');
			response.status(error.status);
			response.send(html);
		}
		
		public processResponse(request, response, actionResult, controller: Controller){
			 try{
				//caso nao retorne nada deixa a request rolar manualmente 
				if(actionResult){ 
					
					if(typeof actionResult == "string"){
						//caso retorne uma string devolve status 200 e envia como html
						response.header('Content-Type', 'text/html');
						response.status = 200;
						response.send(actionResult);
						
					}else if(actionResult.isView){	
						//caso seja uma view renderiza com layout e model
						var html = controller.render(actionResult.viewName, actionResult.model);

						response.header('Content-Type', 'text/html');
						response.status = 200;
						response.send(html);
						
					}else if(actionResult.isStream){
						//realiza um pipe com o stream
						actionResult.result.pipe(response);
						
					}else if(actionResult.isFile){
						//envia arquivo para download
						if(actionResult.filename)
							response.download(actionResult.result, actionResult.filename);
						else
							response.download(actionResult.result);
						
					}else {
						//redireciona
						if(actionResult.contentType == 'redirect'){
							response.redirect(actionResult.status, actionResult.result);
						}else{ 
							//resposta padrão
							response.header('Content-Type', actionResult.contentType);
							response.status(actionResult.status).send(actionResult.result);
						}
					}
				}
			 }catch(ex){
				 this.error(ex, request, response);
			}
		}
		
		
		private removeEmpty(parts: string[]): string[]{
			var noEmptys = [];
			if(!parts)
				return parts;
			
			for(var i = 0; i < parts.length; i++){
				if(parts[i] != null && parts[i] != undefined && parts[i] != ''){
					noEmptys.push(parts[i]);
				}
			}
			return noEmptys;
		}
		
		public match(request, response) : boolean{
			var method = request.method;
			
			var url = require('url');
			var url_parts = url.parse(request.url, true);
			var query = url_parts.query;
			url = url_parts.pathname;
			if(url.length > 1 && (url[url.length - 1] == "/" || url[url.length - 1] == "\\"))
				url = url.substr(0, url.length - 1);
			
			var parts = url.split(/\\|\//);
			parts = this.removeEmpty(parts);
			var result = null;
			for(var i in this.allRoutes){
				var route = this.allRoutes[i];
				
				var containsMethod = false;
				
				for(var j = 0; j < route.type.length; j++)
				{
					if(route.type[j] == method.toLowerCase())
					{
						containsMethod = true;
						break;
					}
				}
				var routeParts = this.removeEmpty(route.url.split(/\\|\//));

				if(!containsMethod || parts.length != routeParts.length)
					continue;
				
				var parameters = {};
				
				parameters["controller"] = route.controller;
				parameters["action"] = route.action;
				var success = true;
				
				for(var j = 0; j < routeParts.length;j++){
					var routePartValue  = routeParts[j].trim();
					var partValue  = parts[j].trim();
					
					if(routePartValue.indexOf("{") == 0 && 
					  (routePartValue.length > 1 && routePartValue[routePartValue.length-1] == "}" ) &&
	     			   routePartValue != "{}"){
						routePartValue = routePartValue.substr(1, routePartValue.length-2).trim();
						parameters[routePartValue] = decodeURIComponent(partValue); 
					}else if(routePartValue != partValue){
						success = false;
						break;
					}
				}
				if(!success || !parameters["controller"] || !parameters["action"])
					continue;
				result = {};
				result["controller"] = parameters["controller"];
				result["action"] = parameters["action"];
				result["parameters"] = [];
				for(var j in parameters)
					if(j != "controller" && j != "action")
						result["parameters"].push(parameters[j]);
				break;
			}
			if(result){
				var controllerName = result["controller"];
				controllerName = (controllerName.charAt(0).toUpperCase() + controllerName.slice(1)) + "Controller";
				var action = result["action"];
				
				var directory = this.appDirectory;
				var controllerClass = null;
				try{
					if(require.main){
						controllerClass = require.main.require("./controllers/"+(controllerName))['default'];
					 //node js repl e arquivo local
				   }else if(__dirname && require.resolve){
						//sobe um nivel acima contando que JSComet.Core.js sempre estará em /libs/JSComet.Core.js
						var fileName = __dirname + "/../controllers/" + (controllerName);
						fileName = require.resolve(fileName);
						controllerClass = require(fileName)['default'];
					}else{
						controllerClass = require("./controllers/"+(controllerName))['default'];
					}
				}catch(ex){
					if(typeof ex.code != "undefined" && ex.code == "MODULE_NOT_FOUND")
						return false;
					
					this.error(ex, request, response);
					return true;
				}
				var controller = new controllerClass();
				controller.request = request;
				controller.response = response;
				controller.params = query || {};
				controller.query = query;
				controller.body = request.body || {};
				controller.files = request.files;
				controller.session = request.session || {};
				
				for(var j in parameters)
					if(j != "controller" && j != "action")
						controller.params[j] = parameters[j];
					
				for(var j in controller.body)
					controller.params[j] = controller.body[j];
				
				controller.viewRenderer = new ViewRenderer(controller, result["controller"], result["action"], this.viewEngine, directory);
				var actionResult = null;
				try{
					if(typeof controller[action] != "function")
						return false;
					
					actionResult = controller[action].apply(controller, result["parameters"]);
					if(actionResult instanceof Promise) //async response
					{
						actionResult
						//async resolved
						.then(actionResult => this.processResponse(request, response, actionResult, controller))
						//async error
						.catch(error => this.error(error, request, response));
						
					}else{//sync response
						this.processResponse(request, response, actionResult, controller);
					}

				}catch(ex){//error
					this.error(ex, request, response);
				}
				return true;
			}

			return false;
		}
	}

	export class JSCometApp{
		public environment: Environment;
		private app: any;
		private config;
		private appDirectory;
		constructor(config, routeEngine: RouteEngine){
			var app = express();
			this.app = app;
			this.config	 = config;
			var directory = routeEngine.appDirectory;
			this.appDirectory = directory;
			app.use(session({
					secret: config.session.secret, 
					name : config.session.name, 
					resave: true, 
					saveUninitialized: true,
					cookie: { maxAge: config.session.maxAge }
			}));
							
			app.use(compression());
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({ extended: false }));
			app.use(cookieParser());
			app.use(config.publicDir, express.static(path.join(directory, config.publicDir)));
			app.use('/favicon.ico', express.static(path.join(directory, 'favicon.ico')));
			app.disable('x-powered-by');
			var router = express.Router();

			var routeHandler = (request, response, next) => {
				if(!routeEngine.match(request, response))
					next();
			};
			router.get("*", routeHandler);
			router.post("*", routeHandler);
			router.put("*",  routeHandler);
			router['delete']("*", routeHandler);
			router.patch("*", routeHandler);
			router.head("*", routeHandler);
			
			app.use("/", router);
			
			// catch 404 and forward to error handler
			app.use((request, response, next)=>{
			  var error = new Error('Not Found');
			  error.status = 404;
			  next(error);
			});

			// error handlers
			app.use((error, request, response, next)=>{
				routeEngine.error(error, request, response);
			});
		}

		
		get express(){
			return this.app;
		}
		
		run(){
			var config = this.config;
			var app = this.app;
			var directory = this.appDirectory;
			return new Promise((resolve)=>{
				
				if(config.ssl){
					try{
						
						var options = {
						  key: fs.readFileSync(path.join(directory, config.ssl.key), "utf8"),
						  cert: fs.readFileSync(path.join(directory, config.ssl.certificate), "utf8")
						};
						var https = require("https");
						var server = https.createServer(options, app).listen(config.port || 443, function() {
							 resolve(server.address().port);
						});
					}catch(ex){
						console.log(ex);
					}
				}else{
					var server = null;
					if(config.port){
						server = app.listen(config.port);
					}else{
						server = app.listen();
					}	
					server.on('listening', function() {
						 resolve(server.address().port);
					});
				}
			});
			
			
		}
	}


}

export {
	JSCometWeb.JSCometApp as JSCometApp, 
	JSCometWeb.Controller as Controller, 
	JSCometWeb.MVCRouteEngine as MVCRouteEngine,
	JSCometWeb.BlissViewEngine as BlissViewEngine,
	JSCometWeb.ViewEngine as ViewEngine,
	JSCometWeb.RouteEngine as RouteEngine,
	JSCometWeb.MVCRoute as MVCRoute,
	JSCometWeb.Environment as Environment
}
export default JSCometWeb;