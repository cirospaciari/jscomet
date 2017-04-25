# Summary

* [Command line tools](#command-line-tools)
* [Transpiler features](#transpiler-features)
* [Decorators](#decorators)
* Web MVC
    * [Routes](#routes)
    * [SSL](#ssl)
    * [Controller](#class-controller)


# Web Project Type
 
The Web project type is a easy way of implement MVC using express.

### Command line tools
 
##### Creating a new project
To create a new project you need to create a solution first, after execute the command the default struct will be create.
```sh
jscomet create solution
jscomet create web myProjectName
```

##### Adding a library
Libraries are a way to make the project more modular and organized, to add one to an existing solution just run the command below.
```sh
jscomet create library myLibName
```

##### Reference a library
JSComet add a easy way to build and copy librarys to libs folder automatic when you build or run your main project.
```sh
jscomet reference add myMainProjectName myLibName
```

##### build and run commands
For simplify build and run process you can just execute run command to first clean, build and after this start the project.
```sh
jscomet run myProjectName
```
If you just need to update bin folder just execute the build command.
```sh
jscomet build myProjectName
```

### Routes
You can routing using routes.json file in project, you can specify the http type of request allowed (get, post, put, delete, patch and head). Using {parameterName} you can add a named parameter in url request. {controller} is the Controller name Without Controller part (Example: HomeController will be just home), {action} is the function/action name.

```json
{
	"home": {
		"url": "/",
		"controller": "Home",
		"action": "index",
		"type": ["get", "post"]
	},
	"default": {
		"url": "/{controller}/{action}/",
		"type": ["get", "post"]
	},
	"defaultWithoutAction": {
		"url": "/{controller}",
		"action": "index",
		"type": ["get", "post"]
	},
	"defaultWithParameter": {
		"url": "/{controller}/{action}/{id}",
		"type": ["get", "post"]
	}
}
```
### SSL
Configurate a ssl is easy you just need to add a "ssl" section in config.json file and inform key and certificate files.

```json
{
	"session": {
		"name": "sessionId",
		"secret" : "3326b169-a39c-9bab-8303-200a70a2876f",
		"maxAge": 1800000
	}, 
	"ssl":{
		"key": "./keys/private.key",
		"certificate" : "./keys/certificate.pem"
	},
	"port": 8443,
	"publicDir": "/assets"
}
```

# class Controller
 
The Controller class is the base type for any Controller and contains all MVC features and helpers implemented in jscomet. All actions can return a ActionResult or a Promise for async results.
### Attributes
 
##### title: string
Page Title can be set on action executions or in Controller constructor.
 
```javascript
class HomeController extends Controller{
	index(){
		this.title = "My page title!!!";
		return this.view();
	}
}
```

##### layout: string
 Master page used for rendering views content by default value is "layout", this will look in directories: 
 * /views/layout.html
 * /views/shared/layout.html
 
 Like title attribute can be set on action execution or in Controller constructor.
 
 ```javascript
class AboutController extends Controller{
	async index(){
		this.layout = "about";
		var companyInformation = await Company.GetGeneralInformation();
		return this.view(companyInformation);
	}
}
```

##### params: object 
This property is an object containing properties mapped to the named route “parameters” and query string parameters. For example, if you have the route /user/{name}, then the “name” property is available as this.params.name or in action parameters (but need to be in order). This object defaults to {}.

 ```javascript
class UserController extends Controller{
	async personal(name){
	    //or var name = this.params.name;
		var model = await User.getUser(name);
        return this.view(model);
	}
}
```

##### query: object 
This property is an object containing all query string parameters. This object defaults to {}.

 ```javascript
class ProductsController extends Controller{
	async search(){
	    var words = this.query.words;
	    var color = this.query.color;
	    var size = this.query.size;
		var model = await Products.searchBy(words, color, size);
        return this.view(model);
	}
}
```
##### files: object ([express](http://expressjs.com/pt-br/3x/api.html#req.files))
This property is a shortcut for request.files object. This contains an object of the files uploaded. This feature is provided by the bodyParser() middleware, though other body parsing middleware may follow this convention as well. This property defaults is {}. See more in [Express documentation](http://expressjs.com/pt-br/3x/api.html#req.files).

##### body: object ([express](http://expressjs.com/pt-br/4x/api.html#req.body))
This property is a shortcut for request.body object. This property is an object containing the parsed request body. This propery defaults is {}. See more in [Express documentation](http://expressjs.com/pt-br/4x/api.html#req.body).

 ```javascript
class ProductsController extends Controller{
	async register(){
	    var email = this.body.email;
	    var password = this.body.password;
	    var passwordConfirmation = this.body.passwordConfirmation;
		var model = await Products.newUser(email, password, passwordConfirmation);
        return this.view(model);
	}
}
```

##### request: object ([express](http://expressjs.com/pt-br/4x/api.html#req))
The request property represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on. You can access query string information, cookies and more see more in [Express documentation](http://expressjs.com/pt-br/4x/api.html#req).
 
 ```javascript
class UserController extends Controller{
	async index(){
	    //access query string information
	    var userId = this.request.query.userId;
		var model = await User.getUser(userId);
		return this.view(model);
	}
}
```
##### response: object ([express](http://expressjs.com/pt-br/4x/api.html#res))
The resquest property represents the HTTP response that an Express app sends when it gets an HTTP request see more in [Express documentation](http://expressjs.com/pt-br/4x/api.html#res).
 
 ```javascript
class UserController extends Controller{
	async login(){
	    var username = this.params.username;
	    var password = this.params.password;
		var model = await User.validateLogin(username, password);
		if(!model.success)
		    return this.view(model);
		    
		if(model.isAdmin){
		     //save or access cookie information
		    this.response.cookie('adminToken', model.token, { path: '/admin' });
		}
        return this.redirect(`/user/${model.slug}`);
	}
}
```

### Functions

##### view(model: object)
Return a ActionResult object that renders a view to the response. If your action/function has a name as "index" and your controller as a name "HomeController" this will look in directories: 
 * /views/home/index.html
 * /views/shared/index.html

 ```javascript
class HomeController extends Controller{
	index(message){
		var model = { message: message };
		return this.view(model);
	}
}
```

##### view(viewName: string, model: object)
Return a ActionResult object that renders a view to the response. If you pass has viewName "about" and your controller as a name "HomeController" this will look in directories: 
 * /views/home/about.html
 * /views/shared/about.html

 ```javascript
class HomeController extends Controller{
	index(message){
		var model = { message: message };
		return this.view("about", model);
	}
}
```
##### json(object, status)
Return a ActionResult object that renders a application/json to the response. Status is a optional parameter and will be status code of your request by default 200.

 ```javascript
class HomeController extends Controller{
	index(message){
		var model = { message: message };
		return this.json(model);
		//Result will be: { message: message }
	}
}
```
##### text(result, status)
Return a ActionResult object that renders a text/plain to the response. Status is a optional parameter and will be status code of your request by default 200.

 ```javascript
class HomeController extends Controller{
	index(){
		return this.text('Hello World!!!');
	}
}
```
##### html(result, status, contentType)
Return a ActionResult object that renders a text/html to the response, status is a optional parameter and will be status code of your request by default 200, contentType is also optional and by default is "text/html".

 ```javascript
class HomeController extends Controller{
	index(){
		return this.html('<h1>Hello World!!!</h1>');
	}
}
```

##### error(result, status)
Return a ActionResult object that renders a view looking errors directory to the response. Status is a optional parameter and will be status code of your request by default 500.

 ```javascript
class HomeController extends Controller{
	index(){
		return this.error('Not found', 404);
	}
}
```

##### async(executor: Function): Promise
Return a Promise object for async results. You can use async/await notation as alternative.

 ```javascript
class HomeController extends Controller{
	index(){
	   return this.async( (resolve, reject) => {
	        About.getInfo().then((model) => {
	            resolve(model);
	        });
	   });
	}
	async about(){
		var model = await About.getInfo();
		return this.view(model);
	}
}
```
##### file(path: string, filename: string)
Return a ActionResult object that send a file stream  to the response, filename is optional.

 ```javascript
class FileController extends Controller{
	download(){
		return this.download("./assets/docs/file.pdf", "myDocName.pdf");
	}
}
```

##### stream(stream)
Return a ActionResult object that send a stream  to the response.

 ```javascript
import * as fs from 'fs';

class FileController extends Controller{
	streamMusic(){
		var stream = fs.createReadStream('./assets/music/file.mp3');
		return this.stream(stream);
	}
}
```

##### buffer(buffer, status, contentType)
Return a ActionResult object that send a buffer to the response, status is a optional parameter and will be status code of your request by default 200, contentType is a optional and the default value is 'application/octet-stream'.

 ```javascript
import * as fs from 'fs';

class FileController extends Controller{
	senfFileBuffer(filename){
    	return this.async( (resolve, reject) => {
        	fs.readFile(filename, function(err, data) {
                (err) ? reject(err) : resolve(data);
            });
        });
    }
}
```

##### render(viewName: string, model) : string
This function is like view function but instead return ActionResult returns the rendered html, viewName is optional.

##### partial(viewName: string, model) : string
This function is like render function but instead return entire html, return view without layout html, viewName is optional. This function can be used in view html to render views and turn the page more modular.

```html
@!(model, html)
<h1>@model.message</h1>
@for(var i in model.persons){
    <p>@html.partial('person', model.persons[i])</p>
}
```

# Decorators
JSComet support decorators to help consume Rest API, cache, log, validation and more features. To use this features you need to install [jscomet.decorators](https://www.npmjs.com/package/jscomet.decorators) package in your project src folder.
```sh
npm install jscomet.decorators
```

### @abstract
Abstract decorators do not allow this class to be instanced only inherited, when applied in a function or property throw a exception if not overrided. Can be used in classes, functions and properties.
```javascript
import { abstract  } from 'jscomet.decorators';
@abstract
class Test{
    name: string = "ciro";
    @abstract
    surname: string;
    
    @abstract
    getMessage(){
    }
}
```

### @sealed
Sealed decorators do not allow this class to be inherited any more. Can be only in classes.
```javascript
import { sealed  } from 'jscomet.decorators';

@sealed
class Test2 extends Test{
    name: string = "ciro";
}
```

### @deprecated(message: string, options: object)
Deprecated decorators can be used to throw a exception or log a warning, options parameter is optional

```javascript
import { deprecated  } from 'jscomet.decorators';

class Test{
    //throw a exception: This function will be removed in future versions. DON'T USE THIS!
    @deprecated("This function will be removed in future versions. DON'T USE THIS!", { error: true })
    test(code: int){
    
    }
    //log a warning: This function will be removed in future versions.
    @deprecated
    test2(code: int){
    
    }
    //log a warning: This function will be removed in future versions. See http://mysite.com/deprecated/test3 for more details.
    @deprecated("This function will be removed in future versions. DON'T USE THIS!", { url: "http://mysite.com/deprecated/test3" })
    test3(code: int){
    
    }
}
//sealed decorators do not allow this class to be inherited any more 
@sealed
class Test2 extends Test{
    name: string = "ciro";
}
```

### @memoryCache(duration: int)
Create a cache in memory using a static object, you can use in class functions and this decorators support async functions.

```javascript
import { memoryCache } from 'jscomet.decorators';

class User{
    //this will create a result cache using function arguments as key for X milliseconds
    @memoryCache(60 * 1000)
    getUserByID(userID){
    }
    //You can use in functions that returns a Promise or async functions
    @memoryCache(60 * 1000)
    async getUsersByName(name){
        return await DAL.User.getUsersByName(name);
    }
}
```

### @httpRequest(url: string, options: object)
HttpRequest decorator is a helper to consume Rest API`s. If a function use this decorator the function will return a Promise and hers body only will be called if the request is NOT successfully.
Parameter url contains a url format to execute a http request:

```javascript
import { httpRequest } from 'jscomet.decorators';

class Sample{
    @httpRequest("http://httpbin.org/get?s={0}")
    getSample(search){
    }
    // {search: "value"}
    @httpRequest("http://httpbin.org/get?s={search}")
    getSample2(data: object){
        //the function body only is called if a http error as throw
        console.error(httpRequest.getLastError());
        //return default value
        return {};
    }
    @httpRequest("http://httpbin.org/post", { method: "post"})
    postSample(data: object){
    }
}

```
The @setting:MySettingName format can be used to add a value in url for not keep the base url hard coded.

```javascript
import { httpRequest } from 'jscomet.decorators';

httpRequest.loadSettings({
    "myUrl": "http://httpbin.org/get"
});

class Sample{
    @httpRequest("@setting:myUrl?s={0}")
    getSample(search){
    }
}
```

Parameter options is optional and can contains the struct bellow:
```javascript
{
      method: "get", //method can be get, post, head, put, update, delete etc (get as default)
      responseType: "text", //responseType can be text or json (text as default)
      contentType: "json", //contentType can be text or json (json as default)
      //can be passed headers ({} as default)
      headers: {
        "MyHeaderName": "MyHeaderValue",
        "MyHeaderName2": "{0}", //use arguments index 0 as value
        "MyHeaderName3": "{headerParam}", //use property headerParam of arguments passed
      }
}
```
### @httpGet(url: string, options: object)
Just a shortcut for httpRequest with default method as get.

### @httpPost(url: string, options: object)
Just a shortcut for httpRequest with default method as post.

# Transpiler Features

main.js
```javascript
import SampleModule, {url} from './js/SampleModule.js';


//Modules can be used as namespace
var sampleClient = SampleModule.Client.getByID(1);

//is possible use String Template, in this case for encodeURIComponent each parameter
var sampleTemplateFunction = url `/client/?email=${sampleClient.email}`;

```

./js/SampleMdule.js:

```javascript
module SampleModule {
	//you can use import and export 
	//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export
	export var UserType = {
		Default : 0,
		Guest : 1,
		Admin : 2,
		Premium : 3
	};

	class User {
		//typed fields are generated as properties get/set, and can be private, public, static, private static e public static
		//if you just want a easy way to create a property you can use any as type
		name : string;
		surname : string;
		email : string;
		password : string;
		type : int = UserType.Default;
		/*
		int is a special validator for number types:

		bit :  min: 0 max: 1
		sbyte :  min: -128 max: 127
		byte :  min: 0 max: 255
		short :  min: -32768 max: 32767
		ushort :  min: 0 max: 65535
		int :  min: -2147483648 max: 2147483647
		uint :  min: 0 max: 4294967295
		long :  min: -9007199254740991  max: 9007199254740991
		ulong :  min: 0  max: 9007199254740991

		this types cant be NaN, null or undefined

		for floats:

		float: min: -3.402823E+38 max: -3.402823E+38
		double: min: -1.7976931348623157e+308 max: 1.7976931348623157e+308

		this types cant be NaN, null or undefined

		you can use more than one type, for example for int nullable you can use:
		age: int | null;

	    For string, number, boolean, object, function e symbol, CANT be undefined and only boolean CANT be null 

		Typed Array shortcuts:

		sbyte[]: Int8Array
		byte[]: Uint8Array
		short[]: Int16Array
		ushort[]: Uint16Array
		int[]: Int32Array
		uint[]: Uint32Array
		float[]: Float32Array
		double[]: Float64Array

		Any type can be declared with Type[] but will be generated as a native Array type

		Samples:
		var a = new sbyte[];
		var a = new sbyte[](10);
		var a = new sbyte[]([1, 2, 3, 4]);
		types: int[];

		Other validators:
		any: accept any value
		char: only string with length equals 1 CANT be null or undefined
		void: force only undefined values can be used for validate returns
		undefined: like void only accept undefined (can be used for optionals params like : string | undefined)
		null: only accept null (can be used for create nullable values like: int | null)
		 */

	
		constructor(name : string, surname : string, email : string, password : string) {
			this.name = name;
			this.email = email;
			this.password = password;
			this.surname = surname;
		}

	
		get fullname() : string {
			return `${this.name} ${this.surname}`;
		}

		toString() {
			return  `${this.name};${this.email};${this.password};${this.surname};${this.type}`;
		}
	}


	export { User as ClientBase };

	export class Client extends User {

		private id : int = 0;

		constructor() {
			super(null, null, null, null);
		}

		//You can create overloads create function/constructor but overloads are differentiated only by the number of parameters and types are not considered
		constructor(user : User) {
			super(user.name, user.surname, user.email, user.password); //super realiza chamadas do construtor da classe herdada
		}

		constructor(id : int, user : User) {
			this(user); //you can use this() for call constructor
			this.id = id;
		}

		public get ID() : int {
			return this.id;
		}

		toString() {
			//super.fieldOrFunction can access functions and fields of inherited class
			return `${super.toString()};${this.id}`;
		}

		private static generateNewPassword() : string {
			return 'xyxxyxyx'.replace(/[xy]/g, (_char) => {
					var random = Math.random() * 16 | 0;
					var value = _char == 'x' ? random : (random & 0x3 | 0x8);
					return value.toString(16);
				});
		}

		public static getByID(id : int) : User {
			/*FAKE QUERY*/
			return new Client(id, new User('Michael',
										   'Silva',
										   'michael.silva@gmail.com',
										   Client.generateNewPassword()));
		}

		public static find(email : string) {
			/*FAKE QUERY*/
			var list = new User[](10);
			for (var i = 0; i < 10; i++) {
				var user = Client.getByID(i + 1);
				user.email = email || user.email;
				list.push(user);
			}
			return list;
		}

		/*
    	Overloads are differentiated only by the number of parameters and types are not considered
		 */
		public static find(name : string, surname : string) {
			/*FAKE QUERY*/
			var list = new User[](10);
			for (var i = 0; i < 10; i++) {
				var user = Client.getByID(i + 1);
				user.name = name || user.name;
				user.surname = surname || user.surname;
				list.push(user);
			}
			return list;
		}

	}
}

/*
Is possible use "..." before a parameter name for create a REST parameter
 */
export function url(pieces, ...substitutions) {
	var result = pieces[0];
	for (var i = 0; i < substitutions.length; ++i) {
		result += encodeURIComponent(substitutions[i]) + pieces[i + 1];
	}
	return result;
}
export default SampleModule;
```

### Sub Classes:

```javascript
class MyClass { 
	class MySubClass{//public
				
	}
	private class MyPrivateSubClass{//private
			
	}
	public class MyPublicSubClass{//public
	}
}
```