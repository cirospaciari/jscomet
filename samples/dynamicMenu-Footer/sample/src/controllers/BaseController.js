import { Controller } from 'jscomet.core';

class BaseController extends Controller{
	
	//Will be called before action request
	async onActionExecuting(){
		this.viewBag.menu = {};
		this.viewBag.footer = {};
		
		for(var i = 0; i < 10; i++){
			this.viewBag.menu[i] = { link: "/", text: `Menu item ${i+1}`}
			this.viewBag.footer[i]  = { link: "/", text: `Footer item ${i+1}`}
		}
	}

}
export default BaseController;