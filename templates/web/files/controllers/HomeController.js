import { Controller } from 'jscomet.core';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	index(){
		return this.index('Hello World!!!');
	}

	index(message){
		var model = { message: message };
		return this.view(model);
	}
}
export default HomeController;
