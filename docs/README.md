# Web Project Type
 
The Web project type is a easy way of implement MVC using express.

### Command line tools
 
##### Creation a new project
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