import { Controller } from 'jscomet.core';
import Product from './models/Product';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	async index(){
		var model = await Product.getHotPage();
		
		return this.view(model);
	}

}
export default HomeController;