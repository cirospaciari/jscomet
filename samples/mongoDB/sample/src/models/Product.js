import * as config from "./config.json";
var BlueBird = require("bluebird");
var MongoDB = BlueBird.promisifyAll(require("mongodb"));
var MongoClient = BlueBird.promisifyAll(MongoDB.MongoClient);

class Product{
	
	static async getHotPage(){
	
		var db = await MongoClient.connectAsync(config.connectionString);
		
		var products = await db.collection("products").find({hotpage: true}).toArrayAsync();
		
		return products;
	}
}

export default Product;