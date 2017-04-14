[![npm package](https://nodei.co/npm/jscomet.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jscomet/)

[![NPM version](https://img.shields.io/npm/v/jscomet.svg)](https://img.shields.io/npm/v/jscomet.svg)
[![NPM License](https://img.shields.io/npm/l/jscomet.svg)](https://img.shields.io/npm/l/jscomet.svg)
[![NPM Downloads](https://img.shields.io/npm/dm/jscomet.svg?maxAge=43200)](https://img.shields.io/npm/dm/jscomet.svg?maxAge=43200)


Pros:

        Types and Return Types checked in runtime
        Truly private functions
        Can be used ahead-of-time (and i recommend it!)
        Can be used directly in the browser
        Fast build
        Fast for use as runtime on smaller frontend projects or used as generated library in bigger projects
        Easy to install, create, build and run
        Nice way to organize and reference js libraries
        


Cons:

        Does not use a proper js parser (but will in the future)
        Generate unnecessary code
        Dont have a proper async and await implementation (but will in the future)
        Dont have all ES6 funcionalities 

        
How install:

npm install jscomet -g

How use:

Project types available: app, console, library, web. (Desktop coming soon)

Command line:

        version                                  show JSComet version
        clean                                    clean all projects
        clean %PROJECT_NAME%                     clean a project
        build %PROJECT_NAME%                     build a project
        create solution                          create a empty solution file
        create %PROJECT_TYPE% %PROJECT_NAME%     create a project
        remove %PROJECT_NAME%                    remove a project
        run %PROJECT_NAME%                       run a project
        publish %PROJECT_NAME% %OUT_DIRECTORY%   publish a project to folder

        reference add %PROJECT_NAME% %REFERENCE_PROJECT_NAME%            add project reference
        reference remove %PROJECT_NAME% %REFERENCE_PROJECT_NAME%         remove project reference
        add %FILE_TEMPLATE% %PROJECT_NAME% %FILE_PATH%                   add a file
         Default Options:
          add html MyProject myHTMLFile
          add xml MyProject myXMLFile
          add js MyProject myJSFile
          add css MyProject myJSFile
          add class MyProject models\myModelClass
          add class MyProject models\myModelClass extended myModelBase
          add class MyProject models\myModelClass singleton
          add controller MyProject myControllerClass
          add view MyProject user\myView
          add layout MyProject myLayout
       

Exemplos:

main.js
```javascript
import SampleModule, {url} from './js/SampleModule.js';

//Modulos servem de namespace para melhor organização
var sampleClient = SampleModule.Client.getByID(1);

//É possivel chamar uma função junto a uma String Template, neste caso para
//usar encodeURIComponent em cada parametro na concatenação facilitando chamadas de api's ou redirecionamentos
var sampleTemplateFunction = url `/client/?email=${sampleClient.email}`;

```

./js/SampleMdule.js:

```javascript
module SampleModule {
	//para tornar algo visivel no modulo basta usar export, este foi implementado de acordo com ES6:
	//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export
	export var UserType = {
		Default : 0,
		Guest : 1,
		Admin : 2,
		Premium : 3
	};

	class User {
		//fields tipados são transformados em get/set automaticamente, podem ser private, public, static, private static e public static
		//não é obrigado adicionar um tipo e caso queira apenas um atalho para criar um get/set pode ser usado o tipo any
		name : string;
		surname : string;
		email : string;
		password : string;
		type : int = UserType.Default;
		/*
		int é um validador especial de int para o tipo number segue lista de validadores:

		bit :  min: 0 max: 1
		sbyte :  min: -128 max: 127
		byte :  min: 0 max: 255
		short :  min: -32768 max: 32767
		ushort :  min: 0 max: 65535
		int :  min: -2147483648 max: 2147483647
		uint :  min: 0 max: 4294967295
		long :  min: -9007199254740991  max: 9007199254740991
		ulong :  min: 0  max: 9007199254740991

		alem da validação de valores minimos e máximos esses NÃO podem ser NaN / null / undefined

		para pontos flutuantes temos:

		float: min: -3.402823E+38 max: -3.402823E+38
		double: min: -1.7976931348623157e+308 max: 1.7976931348623157e+308

		alem da validação de valores minimos e máximos esses NÃO podem ser NaN / null / undefined

		para criar um inteiro/flutuante que aceite null basta usar multipla tipagem exemplo:
		age: int | null;

		Dos tipos nativos string, number, boolean, object, function e symbol, apenas boolean NÃO pode ser null e
		nenhum deles podem ser undefined

		Existem tambem atalhos para Typed Array:

		sbyte[]: Int8Array
		byte[]: Uint8Array
		short[]: Int16Array
		ushort[]: Uint16Array
		int[]: Int32Array
		uint[]: Uint32Array
		float[]: Float32Array
		double[]: Float64Array

		Qualquer tipo pode ser declado com syntax Tipo[] porem serão transformados em Array genericos

		Exemplos:
		var a = new sbyte[];
		var a = new sbyte[](10);
		var a = new sbyte[]([1, 2, 3, 4]);
		types: int[];

		Outros validadores que podem ser usados como tipos:
		any: aceita qualquer valor
		char: string com length 1 e que não pode ser null / undefined
		void: o tipo deve ser undefined (pode ser usado para retorno de métodos
		undefined: o tipo deve ser undefined
		null: o tipo deve ser null
		 */

		/*
		É possivel incluir tipos nos parametros para validação, caso receba um tipo inválido uma exception é disparada
		construtores NÃO aceitam modificadores private / static
		Obs: para aceitar mais de um tipo pode ser usado "|" por exemplo age: int | null
		 */
		constructor(name : string, surname : string, email : string, password : string) {
			this.name = name;
			this.email = email;
			this.password = password;
			this.surname = surname;
		}

		/*
		get/set podem ser podem ser private, public, static, private static e public static

		É possivel incluir tipo de retorno em propriedades ou métodos caso retorne um tipo inválido uma exception é disparada
		Obs: para aceitar mais de um tipo pode ser usado "|" por exemplo age(): int | null { } )
		*/
		get fullname() : string {
			return `${this.name} ${this.surname}`;
		}

		toString() {
			//Tambem damos suporte a template Strings para facilitar a concatenação de expressoes / variaveis
			return  `${this.name};${this.email};${this.password};${this.surname};${this.type}`;
		}
	}

	//É possivel informar um alias ao exportar algo
	export { User as ClientBase };

	//Herança de classes podem ser feitas usando extends lembrando que javascript não suporta herança multipla
	export class Client extends User {

		private id : int = 0;

		constructor() {
			super(null, null, null, null);
		}

		//É possivel criar sobrecargas de construtores desde que a quantidade de parametros seja diferente
		constructor(user : User) {
			super(user.name, user.surname, user.email, user.password); //super realiza chamadas do construtor da classe herdada
		}

		constructor(id : int, user : User) {
			this(user); //Uma sobre carga do construtor da popria classe pode ser chamada usando this()
			this.id = id;
		}

		public get ID() : int {
			return this.id;
		}

		toString() {
			//usando super.campoOuFuncao é possivel acessar métodos e fields da classe herdada
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
		Sobre carga de métodos são feitas validando a quantidade de parametros e não tipos
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
É possivel usar "..." antes de um parametros para indicar que este é um REST parameter
 */
export function url(pieces, ...substitutions) {
	var result = pieces[0];
	for (var i = 0; i < substitutions.length; ++i) {
		result += encodeURIComponent(substitutions[i]) + pieces[i + 1];
	}
	return result;
}
//o uso de export segue o ES6: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export
export default SampleModule;
```

Sub Classes:

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

Decorators (coming soon):

```javascript
import { abstract, sealed, deprecated } from './libs/JSComet.Decorators.js';

@abstract
class Teste{

	@enumerable
	name: string = "ciro";
	surname: string = "spaciari";
	
	@deprecated("This function will be removed in future versions. DON'T USE THIS!", { error: true })
	teste(code: int){
	
	}
}

@sealed
class Teste2 extends Teste{
	@extendDescriptor
	name: string = "ciro";
}
```
