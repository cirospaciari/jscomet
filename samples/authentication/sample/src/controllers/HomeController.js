import { Controller } from 'jscomet.core';
import { userInRule } from 'jscomet.decorators';

class HomeController extends Controller{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	public index(){
		var model = this.session.user;
		return this.view(model);
	}
	public logoff(){
		this.session.user = null;
		return this.redirect("/");
	}
	
	public login(){
		//fake login just for demonstration
		if(this.params.password == "123456"){
			this.session.user = {
				username: this.params.username,
				isAdmin: this.params.username == "admin"
			};
		}
		return this.redirect("/");
	}
	
	//validations are implementeds in ./main.js
	@userInRule("admin")
	public admin(){
		console.log(this);
		var model = this.session.user;
		return this.view(model);
	}
	
	@userInRule("user")
	public user(){
		console.log(this);
		var model = this.session.user;
		return this.view(model);
	}
}
export default HomeController;