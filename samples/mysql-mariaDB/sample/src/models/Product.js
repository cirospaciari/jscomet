import * as config from "./config.json";
var BlueBird = require("bluebird");
var Mysql = require('mysql2/promise');


class Product{
	
	static async getHotPage(){
		var connSettings = config.connectionString;
		connSettings.Promise = BlueBird;
		
		var conn = await Mysql.createConnection(connSettings);
		
		var result = await conn.execute('select name, value from products where hotpage = ?', [1]);
		return result[0];//return rows
	}
}

export default Product;