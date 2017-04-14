import { Controller } from './libs/jscomet.core';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	public index(){
		return this.index('Hello World!!!');
	}

	public index(message){
		var model = { message: message };
		return this.view(model);
	}
}
export default HomeController;