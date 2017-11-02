import * as config from "./config.json";
import * as Sequelize from "sequelize";

var sequelize = new Sequelize(config.connectionString, {logging: false});	
		
var Product = sequelize.define('products', {
  id:  {type: Sequelize.INTEGER, primaryKey: true},
  name: {type: Sequelize.STRING},
  value: {type: Sequelize.DECIMAL(18, 2) },
  hotpage: {type: Sequelize.INTEGER }
}, { timestamps: false });


export default Product;