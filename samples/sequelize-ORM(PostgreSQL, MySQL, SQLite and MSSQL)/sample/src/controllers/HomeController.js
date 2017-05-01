import { Controller } from 'jscomet.core';
import Product from './models/Product';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	async index(){
		var products = await Product.findAll({ where: { hotpage: 1 } });
		return this.view(products);
	}

}
export default HomeController;