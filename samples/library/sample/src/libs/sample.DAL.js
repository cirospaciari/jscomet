var z____memoryImport = z____memoryImport || {};

z____memoryImport['/HttpBinService.js'] = {
 cache: null, code: function(){
 var module = {exports: {}};

var ____imported = JSComet.include('jscomet.decorators', false, z____memoryImport);

var httpGet = ____imported.httpGet;
var httpPost = ____imported.httpPost;
var httpRequest = ____imported.httpRequest;;


var HttpBinService = (function(){
"use strict";

var ___privateStatic___ = {};
function HttpBinService(){
	JSComet.checkClass(this, HttpBinService);
	var ___private___ = {};
	var ___self___ = this;

	var __callSuperConstructor__ = function(){

		___defineAllProperties___.call(___self___);
	}

		var ___defineAllProperties___ = function(){

___self___.sampleGet =  (function sampleGet(search){
  var  z____return = (function sampleGet(search){
        
      
      
      return {};
    }).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});(function($super){	
var desc = Object.getOwnPropertyDescriptor(this || HttpBinService, 'sampleGet');
	
 var superDescriptor = null;
	
desc =httpGet("@settings:httpBinUrl/get?s={0}")(this, 'sampleGet', desc) || desc;
	
Object.defineProperty(this || HttpBinService, 'sampleGet', desc);
}).call(___self___);

___self___.sampleGetNamedParameters =  (function sampleGetNamedParameters(user){
  var  z____return = (function sampleGetNamedParameters(user){
        
      
      
      return {};
    }).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});(function($super){	
var desc = Object.getOwnPropertyDescriptor(this || HttpBinService, 'sampleGetNamedParameters');
	
 var superDescriptor = null;
	
desc =httpGet("@settings:httpBinUrl/get?name={name}&surname={surname}")(this, 'sampleGetNamedParameters', desc) || desc;
	
Object.defineProperty(this || HttpBinService, 'sampleGetNamedParameters', desc);
}).call(___self___);

___self___.samplePost =  (function samplePost(user){
  var  z____return = (function samplePost(user){
        
      
      
      return {};
    }).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;});(function($super){	
var desc = Object.getOwnPropertyDescriptor(this || HttpBinService, 'samplePost');
	
 var superDescriptor = null;
	
desc =httpPost("@settings:httpBinUrl/post")(this, 'samplePost', desc) || desc;
	
Object.defineProperty(this || HttpBinService, 'samplePost', desc);
}).call(___self___);

		};___defineAllProperties___.call(___self___);
	var __callThisConstructor__ = function (){
		(function(){

  var  z____return = (function constructor(){
        }).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;
		}).apply(___self___, arguments);

	};
return __callThisConstructor__.apply(___self___, arguments);}

return HttpBinService;
})();


module.exports['default'] = HttpBinService;


return module.exports;
}
};

z____memoryImport['/User.js'] = {
 cache: null, code: function(){
 var module = {exports: {}};
var User = (function(){
"use strict";

var ___privateStatic___ = {};
function User(name, surname){
	JSComet.checkClass(this, User);
	var ___private___ = {};
	var ___self___ = this;

	var __callSuperConstructor__ = function(){

		___defineAllProperties___.call(___self___);
	}

		var ___defineAllProperties___ = function(){

		this.name = undefined;
		this.surname = undefined;
		};___defineAllProperties___.call(___self___);
	var __callThisConstructor__ = function (){
		(function(){

  var  z____return = (function constructor(name, surname){


if((name != null) &&(typeof name != 'string'))
 throw "User#constructor - the parameter 'name' must be 'string'";

if((surname != null) &&(typeof surname != 'string'))
 throw "User#constructor - the parameter 'surname' must be 'string'";

        
    this.name = name;
    this.surname = surname;
  }).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);
return z____return;
		}).apply(___self___, arguments);

	};
return __callThisConstructor__.apply(___self___, arguments);}

return User;
})();

module.exports['default'] = User;


return module.exports;
}
};


var ____imported = JSComet.include('./HttpBinService', false, z____memoryImport);

var HttpBinService = ____imported.default;;

var ____imported = JSComet.include('./User', false, z____memoryImport);

var User = ____imported.default;;


module.exports.User = User;


module.exports.HttpBinService = HttpBinService;
