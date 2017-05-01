
var ____imported = JSComet.include('jscomet.core', false);

var Controller = ____imported.Controller;;

var ____imported = JSComet.include('jscomet.decorators', false);

var userInRule = ____imported.userInRule;;

var HomeController = (function(Controller){
"use strict";

var ___privateStatic___ = {};
function HomeController(){
	JSComet.checkClass(this, HomeController);
	var ___private___ = {};
	var ___self___ = this;
	var ___super___ = null;

	var __callSuperConstructor__ = function(){

		Controller.apply(___self___, arguments);
		___super___ = JSComet.wrapSuper(___self___);
		___defineAllProperties___.call(___self___);
	}

		var ___defineAllProperties___ = function(){

___self___.index =  (function index(){
  var  z____return = (function index(){
        
		var model = this.session.user;
		return this.view(model);
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});
___self___.logoff =  (function logoff(){
  var  z____return = (function logoff(){
        
		this.session.user = null;
		return this.redirect("/");
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});
___self___.login =  (function login(){
  var  z____return = (function login(){
        
		
		if(this.params.password == "123456"){
			this.session.user = {
				username: this.params.username,
				isAdmin: this.params.username == "admin"
			};
		}
		return this.redirect("/");
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});
___self___.admin =  (function admin(){
  var  z____return = (function admin(){
        
		console.log(this);
		var model = this.session.user;
		return this.view(model);
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});(function($super){	
var desc = Object.getOwnPropertyDescriptor(this || HomeController, 'admin');
	
 var superDescriptor = Object.getOwnPropertyDescriptor($super || Controller, 'admin');
	
desc =userInRule("admin")(this, 'admin', desc) || desc;
	
Object.defineProperty(this || HomeController, 'admin', desc);
}).call(___self___, ___super___);

___self___.user =  (function user(){
  var  z____return = (function user(){
        
		console.log(this);
		var model = this.session.user;
		return this.view(model);
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});(function($super){	
var desc = Object.getOwnPropertyDescriptor(this || HomeController, 'user');
	
 var superDescriptor = Object.getOwnPropertyDescriptor($super || Controller, 'user');
	
desc =userInRule("user")(this, 'user', desc) || desc;
	
Object.defineProperty(this || HomeController, 'user', desc);
}).call(___self___, ___super___);

		};
	var __callThisConstructor__ = function (){
		(function(){

  var  z____return = (function constructor(){
        
	 if(typeof Controller != 'undefined') __callSuperConstructor__.call(this);
		this.title = "Home";
	}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;
		}).apply(___self___, arguments);

	};
return __callThisConstructor__.apply(___self___, arguments);}

JSComet.inherits(HomeController, Controller);

return HomeController;
})(Controller);

module.exports['default'] = HomeController;
