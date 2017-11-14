[![npm package](https://nodei.co/npm/jscomet.png?downloads=true&downloadRank=true?maxAge=30)](https://nodei.co/npm/jscomet/)

[![NPM version](https://img.shields.io/npm/v/jscomet.svg)](https://img.shields.io/npm/v/jscomet.svg) [![NPM License](https://img.shields.io/npm/l/jscomet.svg)](https://img.shields.io/npm/l/jscomet.svg) [![Downloads](https://img.shields.io/npm/dt/jscomet.svg?maxAge=43200)](https://img.shields.io/npm/dt/jscomet.svg?maxAge=60) [![ISSUES](https://img.shields.io/github/issues/cirospaciari/jscomet.svg?maxAge=60)](https://img.shields.io/github/issues/cirospaciari/jscomet.svg?maxAge=60)

JSComet is a easy way of creating apps with OO class like ES6/TypeScript/Babel features with truly private vars and functions, type validations, function overloads, all in runtime and can create libraries like browserify and reference this in projects.
JSComet has an easy to use MVC platform with excellent performance for your web projects please check the benchmarks.

        Types and Return Types checked in runtime
        Truly private functions
        Can be used ahead-of-time (and i recommend it!)
        Can be used directly in the browser
        Fast build
        Fast for use as runtime on smaller frontend projects or used as generated library in bigger projects
        Easy to install, create, build and run
        Nice way to organize and reference js libraries
        
        
How install:

npm install jscomet -g

How use:

Project types available: app, console, library, web. (Desktop coming soon)

For documentation and more details [click here](https://github.com/cirospaciari/jscomet/tree/master/docs)

For examples [click here](https://github.com/cirospaciari/jscomet/tree/master/samples)

Command line:

        version                                  show JSComet version
        clean                                    clean all projects
        clean %PROJECT_NAME%                     clean a project
        build %PROJECT_NAME%                     build a project
        create solution                          create a empty solution file
        create %PROJECT_TYPE% %PROJECT_NAME%     create a project
	     Default Options:
	      create app MyProject
	      create console MyProject
          create web MyProject
	      create library MyProject
	
        remove %PROJECT_NAME%                    remove a project
        run %PROJECT_NAME%                       run a project
        publish %PROJECT_NAME% %OUT_DIRECTORY%   publish a project to folder

        reference add %PROJECT_NAME% %REFERENCE_PROJECT_NAME%            add project reference
        reference remove %PROJECT_NAME% %REFERENCE_PROJECT_NAME%         remove project reference
        add %FILE_TEMPLATE% %PROJECT_NAME% %FILE_PATH%                   add a file
         Default Options:
	      add html  MyProject myHTMLFile
	      add xml   MyProject myXMLFile
	      add js    MyProject myJSFile
          add css   MyProject myCSSFile
          add class MyProject models\myModelClass
          add class MyProject models\myModelClass extended myModelBase
          add class MyProject models\myModelClass singleton
       

### For documentation and more details [click here](https://github.com/cirospaciari/jscomet/tree/master/docs)
### For examples [click here](https://github.com/cirospaciari/jscomet/tree/master/samples)

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


# ApacheBench MVC Test
A little benchmark using ApacheBench for simple performance test JSComet and Sails.

Command:
```sh
ab -k -l -p payload.json -T application/json -n 100000 -c 500 http://localhost:8080/
```
payload.json
```javascript
{
"data": "{'job_id':'c4bb6d130003','container_id':'ab7b85dcac72','status':'Success: process exited with code 0.'}"
}
```
Configurations:

    Intel Core i7-6700HQ @ 2.60GHz
    16 GB RAM
    Windows 10 Pro - 64 bits

### Performance Results:
* ##### JSComet (default) - 7537.64 requests per sec
* ##### JSComet without cluster - 2233.26 requests per sec  (3.37 times slower)
* ##### Sails (default) - 1374.82 requests per sec (5.48 times slower)
* ##### Sails with cluster - 3887.82 requests per sec (1.94 times slower)

JSComet in default configuration use cluster and is 5.48 times faster than Sails in default configuration.

### Code:
#### JSComet:
```javascript
import { Controller } from 'jscomet.core';

class HomeController extends Controller{
	
	public index(){
		var data = this.body;
		return this.json(data);
	}
}
export default HomeController;
```

#### Sails:
```javascript
module.exports = {
  /**
   * CommentController.index()
   */
  index: function (req, res) {
	var data = req.body;
    return res.json(data);
  },
};

```
### Full Default Settings Results:

#### JSComet
```sh
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            8080

Document Path:          /home/
Document Length:        Variable

Concurrency Level:      500
Time taken for tests:   13.267 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      37563602 bytes
Total body sent:        27600000
HTML transferred:       200000 bytes
Requests per second:    7537.64 [#/sec] (mean)
Time per request:       66.334 [ms] (mean)
Time per request:       0.133 [ms] (mean, across all concurrent requests)
Transfer rate:          2765.05 [Kbytes/sec] received
                        2031.63 kb/s sent
                        4796.68 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.6      0     502
Processing:     3   65  40.7     60    1192
Waiting:        3   47  40.5     43    1130
Total:          3   65  40.7     60    1192

Percentage of the requests served within a certain time (ms)
  50%     60
  66%     69
  75%     75
  80%     79
  90%     90
  95%    100
  98%    114
  99%    124
 100%   1192 (longest request)

```
#### Sails
```sh
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            1337

Document Path:          /home/
Document Length:        Variable

Concurrency Level:      500
Time taken for tests:   72.737 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      65762092 bytes
Total body sent:        27600000
HTML transferred:       11900000 bytes
Requests per second:    1374.82 [#/sec] (mean)
Time per request:       363.685 [ms] (mean)
Time per request:       0.727 [ms] (mean, across all concurrent requests)
Transfer rate:          882.92 [Kbytes/sec] received
                        370.56 kb/s sent
                        1253.47 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   2.2      0     501
Processing:    14  361  51.5    358    1058
Waiting:       12  315  52.0    311    1058
Total:        111  361  51.5    358    1058

Percentage of the requests served within a certain time (ms)
  50%    358
  66%    365
  75%    371
  80%    377
  90%    401
  95%    433
  98%    451
  99%    480
 100%   1058 (longest request)
```


# Decorators  (for more information [click here](https://www.npmjs.com/package/jscomet.decorators))
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
