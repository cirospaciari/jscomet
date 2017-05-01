global.JSComet = require('./libs/jscomet')['default'];

var ____imported = JSComet.include('cluster', false);

var cluster = ____imported;;

var ____imported = JSComet.include('os', false);

var os = ____imported;;

var ____imported = JSComet.include("./config.json", false);

var config = ____imported;;

var ____imported = JSComet.include("jscomet.core", false);

var JSCometApp = ____imported.JSCometApp;
var BlissViewEngine = ____imported.BlissViewEngine;
var MVCRouteEngine = ____imported.MVCRouteEngine;;

var ____imported = JSComet.include('jscomet.decorators', false);

var userInRule = ____imported.userInRule;;


if(cluster.isMaster)
{
	
    var cpuCount = os.cpus().length;

    
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
	
	
	console.log("Static files in "+(config.publicDir));
	
}else{
	
	var viewEngine = new BlissViewEngine();

	
	var router = new MVCRouteEngine(__dirname, viewEngine);

	
	router.load("./routes.json");

	
	userInRule.setRuleValidator(((function(_this){ return (function(){return (function (controller, ruleName){
		console.log(controller, ruleName);
		if(!controller.session["user"]) 
			return controller.redirect("/home/login");
		
		
		if(ruleName == "admin" && !controller.session.user.isAdmin){ 
			return controller.redirect("/home/login");
		}
		
		return true;
	}).apply(_this,arguments)});})(this)));
	
	var app = new JSCometApp(config, router);

	
	
	app.run().then(function(port){
		console.log("Process "+(process.pid)+" is listening in "+(port)+" port");
	});
}
