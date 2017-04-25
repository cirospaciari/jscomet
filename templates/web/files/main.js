global.JSComet = require('./libs/jscomet')['default'];
import * as cluster from 'cluster';
import * as os from 'os';
import * as config from "./config.json";
import { JSCometApp, BlissViewEngine, MVCRouteEngine } from "jscomet.core";

//create forks for best performance
if(cluster.isMaster)
{
	// Count the machine's CPUs
    var cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
	
	//display config
	console.log(`Static files in ${config.publicDir}`);
	
}else{
	//create Bliss/Razor view engine
	var viewEngine = new BlissViewEngine();

	//create MVC Route Engine
	var router = new MVCRouteEngine(__dirname, viewEngine);

	//Load routes from JSON (or use router.route(route: MVCRoute))
	router.load("./routes.json");

	//create app
	var app = new JSCometApp(config, router);

	//run app
	app.run().then(function(port){
		console.log(`Process ${process.pid} is listening in ${port} port`);
	});
}