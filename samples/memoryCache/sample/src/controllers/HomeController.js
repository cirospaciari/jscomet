import { Controller } from 'jscomet.core';
import { memoryCache } from 'jscomet.decorators';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	@memoryCache(3000) //cache with 3 seconds by username
	private countAHit(username){
		this.session.hitCounter  = (this.session.hitCounter || 0) + 1;
		return this.session.hitCounter;
	}
	
	@memoryCache(3000) //cache with 3 seconds globally
	public index(message){
		
		this.session.hitCounter  = (this.session.hitCounter || 0) + 1;
		
		var model = { message: `You loaded without cache ${this.session.hitCounter} times` };
		return this.view(model);
	}
}
export default HomeController;