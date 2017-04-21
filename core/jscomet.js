
var JSComet = function () {
	
    //----------------------------------------------------------------------
    // ES5 15.2 Object Objects
    //----------------------------------------------------------------------

    //
    // ES5 15.2.3 Properties of the Object Constructor
    //

    // ES5 15.2.3.2 Object.getPrototypeOf ( O )
    // From http://ejohn.org/blog/objectgetprototypeof/
    // NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case
    // since the constructor property is destroyed.
    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function (o) {
            if (o !== Object(o)) { throw TypeError("Object.getPrototypeOf called on non-object"); }
            return o.__proto__ || o.constructor.prototype || Object.prototype;
        };
    }
    // ES5 15.2.3.4 Object.getOwnPropertyNames ( O )
    if (typeof Object.getOwnPropertyNames !== "function") {
        Object.getOwnPropertyNames = function (o) {
            if (o !== Object(o)) { throw TypeError("Object.getOwnPropertyNames called on non-object"); }
            var props = [], p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    props.push(p);
                }
            }
            return props;
        };
    }

    // ES5 15.2.3.5 Object.create ( O [, Properties] )
    if (typeof Object.create !== "function") {
        Object.create = function (prototype, properties) {
            if (typeof prototype !== "object") { throw TypeError(); }
            function Ctor() { }
            Ctor.prototype = prototype;
            var o = new Ctor();
            if (prototype) { o.constructor = Ctor; }
            if (properties !== undefined) {
                if (properties !== Object(properties)) { throw TypeError(); }
                Object.defineProperties(o, properties);
            }
            return o;
        };
    }

    // ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
    // Partial support for most common case - getters, setters, and values
    (function () {
        if (!Object.defineProperty ||
            !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } }())) {
            var orig = Object.defineProperty;
            Object.defineProperty = function (o, prop, desc) {
                // In IE8 try built-in implementation for defining properties on DOM prototypes.
                if (orig) { try { return orig(o, prop, desc); } catch (e) { } }

                if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
                if (Object.prototype.__defineGetter__ && ('get' in desc)) {
                    Object.prototype.__defineGetter__.call(o, prop, desc.get);
                }
                if (Object.prototype.__defineSetter__ && ('set' in desc)) {
                    Object.prototype.__defineSetter__.call(o, prop, desc.set);
                }
                if ('value' in desc) {
                    o[prop] = desc.value;
                }
                return o;
            };
        }
    }());

    // ES 15.2.3.7 Object.defineProperties ( O, Properties )
    if (typeof Object.defineProperties !== "function") {
        Object.defineProperties = function (o, properties) {
            if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
            var name;
            for (name in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, name)) {
                    Object.defineProperty(o, name, properties[name]);
                }
            }
            return o;
        };
    }


    // ES5 15.2.3.14 Object.keys ( O )
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
            var ret = [], p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    ret.push(p);
                }
            }
            return ret;
        };
    }
    if (!Object.freeze) {
        Object.freeze = function (obj) {
            var props = Object.getOwnPropertyNames(obj);

            for (var i = 0; i < props.length; i++) {
                var desc = Object.getOwnPropertyDescriptor(obj, props[i]);

                if ("value" in desc) {
                    desc.writable = false;
                }

                desc.configurable = false;
                Object.defineProperty(obj, props[i], desc);
            }
            return obj;
        };
    }


    var indexOf = function (self, elt) {
        var len = self.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
			? Math.ceil(from)
			: Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in self &&
                self[from] === elt)
                return from;
        }
        return -1;
    };
    this.z____importCache = {};
    function defaultOptions() {
        return {
            translateModule: true,
            translateExports: true,
            translateClass: true,
            translateImports: true,
            translateStringTemplates: true,
            translateArrowFunctions: true,
            translateLetAndConst: true,
            translateFunctions: true,
			translateAsyncFunctions: true,
            translateTypedArrays: true,
            translateCodeAfterImport: true
        };
    }
    this.options = defaultOptions();
    this.wrapSuper = function(instance){
  		var __super__ = {};
  		var __superDescriptions__ = {};
  		var props = Object.getOwnPropertyNames(instance);

          for (var i = 0; i < props.length; i++) {
              var desc = Object.getOwnPropertyDescriptor(instance, props[i]);

              Object.defineProperty(__super__, props[i], desc);
          }
  		return __super__;
  	};
    this.inherits = function(Target, Super){
  		Target.prototype = Object.create( Super.prototype, {
  			constructor: {
  				value: Target,
  				enumerable: false,
  				writable: true,
  				configurable: true
  			}
  		});
  	}
    this.checkClass = function(instance, Constructor){
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
  this.defineProperty = function(target, descriptor, sealed) {
  		sealed = sealed || false;
  		descriptor.enumerable = descriptor.enumerable || false;
  		descriptor.configurable = !sealed;
  		if ("value" in descriptor)
  			descriptor.writable = !sealed;
  		Object.defineProperty(target, descriptor.key, descriptor);
  };

	this.toAbsoluteURL = function(relative, base) {
		if(relative.indexOf('/') == 0 || relative.indexOf('\\') == 0 || /^((f|ht)tps?:)?\/\//.test(relative))
		   return relative;
		if(base.length > 0 && (base[base.length - 1] == "/" || base[base.length - 1] == "\\" ))
			base = base.substring(0, base.length - 1);
		var stack = base.split(/\\|\//);
		var parts = relative.split(/\\|\//);
		for (var i=0; i<parts.length; i++) {
			if (parts[i] == ".")
				continue;
			if (parts[i] == "..")
				stack.pop();
			else
				stack.push(parts[i]);
		}
		return stack.join("/");
	}
    this.include = function (source, translateCodeAfterImport, z____memoryImport) {
        source = (source || "");
		if(typeof z____memoryImport != "undefined"){
			var memorySource = this.toAbsoluteURL(source, "/");
			var extension = (/[.]/.exec(memorySource)) ? /[^.]+$/.exec(memorySource)[0] : undefined;
			if (!extension)
				memorySource += ".js";

			if(typeof z____memoryImport[memorySource] != "undefined")
			{
				if(!z____memoryImport[memorySource].cache){
					z____memoryImport[memorySource].cache = z____memoryImport[memorySource].code();
				}
				exports = z____memoryImport[memorySource].cache;
				if(exports)
					return exports;
			}
		}
		if(require.main)//node js
			return require.main.require(source, translateCodeAfterImport);
		else if(typeof __dirname != "undefined" && source.indexOf('.') == 0 && require.resolve){//node js repl e arquivo local
		
			source = __dirname + '/.' + source;//sobe um nivel acima contando que jscomet.js sempre estará em /libs/jscomet.js
			source = require.resolve(source);
			return require(source, translateCodeAfterImport);
		}

		return require(source, translateCodeAfterImport);
    }

    this.require = function (source, translateCodeAfterImport) {
         var file = source.split(/(\\|\/)/).pop();

        var extension = (/[.]/.exec(file)) ? /[^.]+$/.exec(file)[0] : undefined;

        if (!extension) {
            source += ".js";
            extension = ".js";
        }

		var base = "/";
		try{
			base = document.location.pathname;
		}catch(ex){}
		var getDirname = function(pathname, separator) {
			var parts = pathname.split(separator);
			if (parts[parts.length - 1].indexOf('.') > -1) {
				return parts.slice(0, -1).join(separator)
			}
			return pathname;
		}
		base = getDirname(base, '/');
		if(base.indexOf('/', base.length - 1) != base.length - 1)
		{
		  base += "/";
		}

		source = this.toAbsoluteURL(source, base);
        if (typeof this.z____importCache[source] == "undefined") {
            var self = this;
            function callRequest() {
                var oReq = new XMLHttpRequest();

                oReq.onreadystatechange = function () {

                    if (oReq.readyState != 4)
                        return false;

                    if (oReq.status == 200) {

                        if (extension == "json") {
                            //var url = oReq.responseURL;
                            try {
                                self.z____importCache[source] = {};
                                self.z____importCache[source]['default'] = JSON.parse(this.responseText);
                            } catch (ex) {
                                self.z____importCache[source] = null;
                            }
                        } else {
                            var code = this.responseText;
                            if(translateCodeAfterImport)
                                code = self.translate(code);

                            function evalInContext(code) {
                                code = "\nvar exports = this.module.exports;\nvar module = this.module;\n" + (code || "");
                                eval(code);
                            };

                            var context = {
                                module: {
                                    exports: {
                                    }
                                }
                            };

                            context.exports = context.module.exports;
                            evalInContext.call(context, code);

                            self.z____importCache[source] = context.module.exports;
                        }
                    }

                };
                oReq.open("get", source, false);
                oReq.send();
            }
            callRequest();
        }

        return this.z____importCache[source];
    };
    var isInnerStringOrRegex = function (code, index) {
        var nextLineBreak = code.length - 1;
        for (var i = index; i < code.length; i++) {
            if (code[i] == "\n") {
                nextLineBreak = i;
                break;
            }
        }
        if (nextLineBreak == -1)
            var previousLineBreak = 0;

        for (var i = index; i >= 0; i--) {
            if (code[i] == "\n") {
                previousLineBreak = i;
                break;
            }
        }
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var regexIsOpen = false;
        var last = null;
        var lastNonSpace = null;
        for (var i = previousLineBreak; i <= nextLineBreak; i++) {
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {
                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (i == index)
                return stringIsOpen || regexIsOpen;
        }
    };
    var especialTypes = ["string", "number", "boolean", "object", "function", "symbol"];
	
    var especialTypesObject = ["String", "Number", "Boolean", "Object", "Function", "Symbol"];
    var especialTypesNullable = [true, true, false, true, true, true];
    var especialLineEnds = ["var", "let", "const", "function", "class", "import", "export", "private", "public", "static"];
	var typesDefaultValues = {
		"bit": 0,
        "sbyte": 0,
        "byte": 0,
        "short": 0,
        "ushort": 0,
        "int": 0,
        "uint": 0,
        "long": 0,
        "ulong": 0,
		"float": "0.00",
		"double": "0.00",
		"number": 0,
		"any": "undefined",
		"Boolean": false,
		"boolean": false,
	}
    var especialIntValidation = {
        "bit": { min: 0, max: 1 },
        "sbyte": { min: -128, max: 127 },
        "byte": { min: 0, max: 255 },
        "short": { min: -32768, max: 32767 },
        "ushort": { min: 0, max: 65535 },
        "int": { min: -2147483648, max: 2147483647 },
        "uint": { min: 0, max: 4294967295 },
        "long": { min: -9007199254740991, max: 9007199254740991 },
        "ulong": { min: 0, max: 9007199254740991 }
    };
    var typedArrayValidation = {
        "sbyte": "Int8Array",
        "byte": "Uint8Array",
        "short": "Int16Array",
        "ushort": "Uint16Array",
        "int": "Int32Array",
        "uint": "Uint32Array",
        "float": "Float32Array",
        "double": "Float64Array"
    };
    var especialFloatValidation = {
        "float": { min: -3.402823E+38, max: -3.402823E+38 },
        "double": { min: -1.7976931348623157e+308, max: 1.7976931348623157e+308 }
    };
    var getValidationForType = function (type, parameterName) {
        type = trim(type);
        parameterName = trim(parameterName);
        var validation = "";
        if (type == "any")
            return validation;

        if (type == "null") {
            validation += "(" + parameterName + " !== null)\n ";
            return validation;
        }
        if (type == "undefined" || type == "void") {
            validation += "(typeof " + parameterName + " != 'undefined')\n ";
            return validation;
        }
        if (type == 'char') {
            validation += "((typeof " + parameterName + " != 'string') && \n ";
            validation += " !(" + parameterName + " instanceof String)) || " + parameterName + "length != 1)";
            return validation;
        }
        var index = indexOf(especialTypes, type);

        if (index > -1) {
            validation += "(";
            if (especialTypesNullable[index])
                validation += "(" + parameterName + " != null) &&"
            validation += "(typeof " + parameterName + " != '" + especialTypes[index] + "'))";
            return validation;
        }
        var especialInt = especialIntValidation[type];
        if (especialInt) {
            validation += "((typeof " + parameterName + " != 'number') ||\n " + parameterName + " !== parseInt(" + parameterName + ", 10)";
            validation += "|| isNaN(" + parameterName + ")\n";
            validation += " || " + parameterName + " > " + especialInt.max + "\n";
            validation += " || " + parameterName + " < " + especialInt.min + ")";
            return validation;
        }
        var especialFloat = especialFloatValidation[type];
        if (especialFloat) {
            validation += "((typeof " + parameterName + " != 'number') ||\n";
            validation += "|| isNaN(parseFloat(" + parameterName + "))";
            validation += " || " + parameterName + " > " + especialFloat.max + "\n";
            validation += " || " + parameterName + " < " + especialFloat.min + ")";
            return validation;
        }

        validation += "(" + parameterName + " !== null && !(" + parameterName + " instanceof " + type + "))";
        return validation;
    };
    var getErrorForType = function (type, parameterName, isProperty, isReturn) {
        type = trim(type);
        parameterName = trim(parameterName);
        isProperty = isProperty || false;
        isReturn = isReturn || false;
        var name = 'parameter';
        if (isProperty)
            name = 'property';
        else if (isReturn)
            name = 'return type';

        if (type == "any")
            return "";
        if (type == "null") {
            if (isReturn)
                return "the " + name + " must be 'null'";
            return "the " + name + " '" + parameterName + "' must be 'null'";
        }
        if (type == "undefined" || type == "void") {
            if (isReturn)
                return "the " + name + " must be 'undefined'";
            return "the " + name + " '" + parameterName + "' must be 'undefined'";
        }
        if (type == 'char') {
            if (isReturn)
                return "the " + name + " must be 'char'";
            return "the " + name + " '" + parameterName + "' must be 'char'";
        }
        var index = indexOf(especialTypes, type);
        if (index > -1) {
            if (isReturn)
                return "the " + name + " must be '" + especialTypes[index] + "'";
            return "the " + name + " '" + parameterName + "' must be '" + especialTypes[index] + "'";
        }

        var especialInt = especialIntValidation[type];
        if (especialInt) {
            if (isReturn)
                return "the " + name + " must be a integer between " + especialInt.min + " and " + especialInt.max;
            return "the " + name + " '" + parameterName + "' must be a integer between " + especialInt.min + " and " + especialInt.max;
        }
        var especialFloat = especialFloatValidation[type];
        if (especialFloat) {
            if (isReturn)
                return "the " + name + " must be a floating point between " + especialInt.min + " and " + especialInt.max;
            return "the " + name + " '" + parameterName + "' must be a floating point between " + especialInt.min + " and " + especialInt.max;
        }
        if (isReturn)
            return "the " + name + " must be '" + type + "'";
        return "the " + name + " '" + parameterName + "' must be '" + type + "'";
    };
    var globalEval = (function() {

      var isIndirectEvalGlobal = (function(original, Object) {
        try {
          // Does `Object` resolve to a local variable, or to a global, built-in `Object`,
          // reference to which we passed as a first argument?
          return (1,eval)('Object') === original;
        }
        catch(err) {
          // if indirect eval errors out (as allowed per ES3), then just bail out with `false`
          return false;
        }
      })(Object, 123);

      if (isIndirectEvalGlobal) {

        // if indirect eval executes code globally, use it
        return function(expression) {
          return (1,eval)(expression);
        };
      }
      else if (typeof window.execScript !== 'undefined') {

        // if `window.execScript exists`, use it
        return function(expression) {
          return window.execScript(expression);
        };
      }

      // otherwise, globalEval is `undefined` since nothing is returned
      return eval;
    })();

    var run = function (code, options) {
        if(code){
            var es5 = JSComet.translate(code, options);
            globalEval(es5);
        }
    };

    var getFullValidationForTypes = function (types, parameterName, isProperty, isReturn, methodName, typeName) {
        var validation = "";
        isProperty = isProperty || false;
        isReturn = isReturn || false;
        var name = 'parameter';
        if (isProperty)
            name = 'property';
        else if (isReturn)
            name = 'return type';
        parameterName = trim(parameterName);
        if (types.length == 0)
            return null;

        if (parameterName.indexOf("...") == 0)
            parameterName = parameterName.substr(3);
        if (types.length == 1) {
            validation = getValidationForType(types[0], parameterName);
            if (!validation || trim(validation).length == 0)
                return null;
			if(typeName)
				return "\nif" + validation + "\n throw \"" + typeName + "#" + methodName + " - " + getErrorForType(types[0], parameterName, isProperty, isReturn) + "\";";
			else
				return "\nif" + validation + "\n throw \"" + methodName + " - " + getErrorForType(types[0], parameterName, isProperty, isReturn) + "\";";
        }
        var errorMessage = "the " + name + " '" + parameterName + "' must be between types ";
        if (isReturn)
            errorMessage = "the " + name + " must be between types ";

        for (var i = 0; i < types.length; i++) {
            var typeValidation = "";
            typeValidation = getValidationForType(types[i], parameterName);
            if (!typeValidation || trim(typeValidation).length == 0)
                return null;

            if (i > 0) {
                errorMessage += ", ";
                validation += " ||\n ";
            }
            validation += "!" + typeValidation;
            errorMessage += "'" + trim(types[i]) + "'";
        }
        if (!validation || trim(validation).length == 0)
            return null;
		if(typeName)
			return "\nif(!(" + validation + "))\n throw \"" + typeName + "#" + methodName + " - " + errorMessage + "\";";
		else
			return "\nif(!(" + validation + "))\n throw \"" + methodName + " - " + errorMessage + "\";";
    }
    var getNextEqualsPosition = function (code, start) {
        for (var i = start; i < code.length; i++) {
            if (code[i] == "=" || code[i] == "\n" || code[i] == ";")
                return { value: code[i], index: i };
        }
        return { value: ";", index: code.length };
    }
	var getActualLine = function(text, start){
		
		if(start < text.length){
			if(text[start] == '\n')
				start--;
		}
		if(start < 0)
			start = 0;

		var lineEnd = start;
		
		var lineStart = lineEnd;
		
		for(var i = start; i < text.length; i++){
			lineEnd = i;
			if(text[i] == '\n'){
				break;
			}
		}
		for(var i = start; i >= 0; i--){
			if(text[i] == '\n'){
				break;
			}
			lineStart = i;
		}

		if(lineStart < 0)
			lineStart = 0;
		
		if(lineEnd > text.length)
			lineEnd = text.length;
		
		return { 
			start: lineStart,
			end: lineEnd,
			value: text.substring(lineStart, lineEnd)
		}
	}
	var getLastLine = function(text, start){
		
		var line = getActualLine(text, start);
		
		return getActualLine(text, line.start - 1);
	};
	var throwLineError = function (text, index, message, type) {
		var line = getActualLine(text, index);

		message = message || "";
		
		var errorMessage = "TranslateError";
		if(type){
			if(type.className){
				errorMessage += " in " + type.className + "#" + type.name;
			}else{
				errorMessage += " in class " + type.name;
			}
		}
		errorMessage += ": ";
		
		if(message)
			errorMessage += message + "\n";
		
		errorMessage += "Error line:\n";
		errorMessage += line.value;
		var column = index - line.start;
		errorMessage += "\n" + new Array(column + 1).join(" ") + "^";
		
		//throw new SyntaxError(message);
		//console.error(errorMessage);
		throw new Error(errorMessage);
	};
	var getNextLine = function(text, start){
		
		var line = getActualLine(text, start);
		
		return getActualLine(text, line.end + 1);
	};
    var trim = function (text) {
        if (!text)
            return text;
        return text.replace(/^\s+|\s+$/g, '');
    };
    var getRemainingLine = function (code, start) {
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var last = null;
        var regexIsOpen = false;
        lastNonSpace = null;
        for (var i = start; i < code.length; i++) {
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {

                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\') {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\') {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (regexIsOpen) {
                last = code[i];
                continue;
            }

            if (code[i] == "(") {
                var parenthesesIndexes = getNextParenthesesStartEnd(code, i);
                if (parenthesesIndexes == null) {
					throwLineError(code, i, "Syntax Error ( and ) expected");
                }
                var endOfLine = trim(code.substring(start, i + 1)) == "(";
                i = parenthesesIndexes[1];
                var nextChar = getNextValidCharacter(code, i + 1);
                if (nextChar != null && nextChar.value == ";") {
                    i = nextChar.index - 1;
                }
                last = code[i];
                if (endOfLine) {
                    return {
                        start: start,
                        end: i - 1,
                        value: code.substring(start, i + 1)
                    };
                }
                continue;
            }
            if(/\s|\n|\r/.test(code[i]))
                continue;
            if (code[i] == "{") {
                var braceIndexes = getNextBraceStartEnd(code, i);
                if (braceIndexes == null) {
                    throwLineError(code, i, "Syntax Error { and } expected");
                }
                var endOfLine = trim(code.substring(start, i + 1)) == "{" || trim(code.substring(start, i)).indexOf("function") == 0;
                i = braceIndexes[1];
                var nextChar = getNextValidCharacter(code, i + 1);
                if (nextChar != null && nextChar.value == ";") {
                    i = nextChar.index - 1;
                }
                last = code[i];

                if (endOfLine) {
                    return {
                        start: start,
                        end: i,
                        value: code.substring(start, i + 1)
                    };
                }
                continue;
            }
            if (code[i] == ")" || code[i] == "}")
                return {
                    start: start,
                    end: i - 1,
                    value: code.substring(start, i)
                };
            if (code[i] == ";")
                return {
                    start: start,
                    end: i,
                    value: code.substring(start, i)
                };

            var nextWord = getNextWord(code, i);
            if (nextWord != null && indexOf(especialLineEnds, trim(nextWord.value)) > -1 &&
                trim(code.substring(start, nextWord.end)) != trim(nextWord.value))
                return {
                    start: start,
                    end: nextWord.start - 1,
                    value: code.substring(start, nextWord.start - 1)
                };

            last = code[i];
        }
        return {
            start: start,
            end: code.length,
            value: code.substr(start)
        };
    };
    var getNextWordStart = function (code, start, search) {
        start = start || 0;
        search = search || 'class';
        var index = -1;// code.indexOf('class ', start);
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var regexIsOpen = false;
        var last = null;
        var lastNonSpace = null;
        for (var i = start; i < code.length; i++) {
            //ignore string content
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {
                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (regexIsOpen) {
                last = code[i];
                continue;
            }
            if ((i == 0 || /[\s]/.test(code[i - 1]) || /[a-zAZ]/.test(code[i])) &&
				/[\s]/.test(code[i + search.length]) &&
				code.substr(i, search.length) == search) {
                index = i;
                break;
            }
            last = code[i];
        }
        if (index < 0) {
            return -1;
        }
        return index;
    };
	var removeComments_old = function(code){
		var newCode = code;

        do {
          code = newCode;
          newCode = code.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(?:[^\\])(\/\/.*)/g, "");
        } while (code != newCode);

        return newCode;
	}
    var removeComments = function (code) {
        
		var str = code;
		var newCode = '';
		var mode = {
			singleQuote: false,
			doubleQuote: false,
			templateString: false,
			regex: false,
			blockComment: false,
			lineComment: false
		};
		
		var isInAnyMode = function(){
			if(mode.singleQuote)
				return true;
			if(mode.doubleQuote)
				return true;
			if(mode.templateString)
				return true;
			if(mode.regex)
				return true;
			if(mode.blockComment)
				return true;
			if(mode.lineComment)
				return true;
			return false;
		}
		
		for(var i = 0; i < code.length; i++){
			var actual = code[i];
			var last = code[i - 1];
			var secondLast = code[i - 2];
			var next = code[i + 1];
			
			
			if(isInAnyMode()){
				if(mode.regex && actual == '/' && (last != '\\' ||  secondLast == '\\')){
					mode.regex = false;
				}else if(mode.templateString && actual == "`" && (last != '\\' ||  secondLast == '\\')){
					mode.templateString = false;
				}else if(mode.singleQuote && actual == "'" && (last != '\\' ||  secondLast == '\\')){
					mode.singleQuote = false;
				}else if(mode.doubleQuote && actual == '"' && (last != '\\' ||  secondLast == '\\')){
					mode.doubleQuote = false;
				}else if(mode.lineComment){
					if(next == '\n'){
						mode.lineComment = false;
					}
					continue;
				}else if(mode.blockComment){
					if(actual == '/' && last == '*'){
						mode.blockComment = false;
					}
					continue;
				}
			}else{
				if(actual == '`'){
					mode.templateString = true;
				}else if(actual == '"'){
					mode.doubleQuote = true;
				}else if(actual == "'"){
					mode.singleQuote = true;
				}else if(actual == '/'){
					if (next == '*') {
						mode.blockComment = true;
						continue;
					}
					if (next == '/') {
						mode.lineComment = true;
						continue;
					}
					mode.regex = true;
				}
			}
			newCode += actual;
			
		}
		return newCode;
    }

    var getNextBraceStart = function (code, start) {
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var last = null;
        var regexIsOpen = false;
        lastNonSpace = null;
        for (var i = start; i < code.length; i++) {
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {

                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (regexIsOpen) {
                last = code[i];
                continue;
            }
            if (code[i] == "{") {
                return i;
            }
        }
        return null;
    };
    var getNextBraceStartEnd = function (code, start) {
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var braceCount = 0;
        var firstBrace = -1;
        var regexIsOpen = false;
        var last = null;
        var lastNonSpace = null;
        for (var i = start; i < code.length; i++) {
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {
                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (regexIsOpen) {
                last = code[i];
                continue;
            }
            if (code[i] == "{") {
                braceCount++;
                if (firstBrace == -1)
                    firstBrace = i;
                last = code[i];
                continue;
            }

            if (code[i] == "}") {
                braceCount--;
                if (braceCount == 0 && firstBrace != -1)
                    return [firstBrace, i];
                if (braceCount == -1)
                    return null;
            }
            last = code[i];
        }

        return null;
    }
    var getNextParenthesesStartEnd = function (code, start) {
        var stringIsOpen = false;
        var stringCaracter = '\"';
        var braceCount = 0;
        var firstBrace = -1;
        var regexIsOpen = false;
        var last = null;
        var lastNonSpace = null;
        for (var i = start; i < code.length; i++) {
            if (last != null && !(/[\s]/.test(last) && last != '\n')) {
                lastNonSpace = last;
            }
            if (!regexIsOpen) {
                //ignore string content
                if (code[i] == "'" || code[i] == '"') {
                    if (stringIsOpen && code[i] == stringCaracter) {
                        if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                            stringIsOpen = false;
                            last = code[i];
                            continue;
                        }
                    } else if (!stringIsOpen) {
                        stringIsOpen = true;
                        stringCaracter = code[i];
                        last = code[i];
                        continue;
                    }
                }
                if (stringIsOpen) {
                    last = code[i];
                    continue;
                }
            }
            //ignore regex content
            if (code[i] == '/') {
                if (regexIsOpen) {
                    if (last != '\\' || ( i-2 >= 0 && code[i-2] == '\\')) {
                        regexIsOpen = false;
                        last = code[i];
                        continue;
                    }
                } else if (lastNonSpace == null || (!/[0-9]/.test(lastNonSpace) && !/[a-zA-Z]/.test(lastNonSpace)
                            && lastNonSpace != "$" && lastNonSpace != "_" && lastNonSpace != ")" && lastNonSpace != "]")) {
                    regexIsOpen = true;
                    last = code[i];
                    continue;
                }
            }
            if (regexIsOpen) {
                last = code[i];
                continue;
            }
            if (code[i] == "(") {
                braceCount++;
                if (firstBrace == -1)
                    firstBrace = i;
                last = code[i];
                continue;
            }

            if (code[i] == ")") {
                braceCount--;
                if (braceCount == 0 && firstBrace != -1)
                    return [firstBrace, i];
                if (braceCount == -1)
                    return null;
            }
            last = code[i];
        }

        return null;
    }
    var getNextWord = function (code, start) {
        var wordStart = -1;
        var wordEnd = -1;
        for (var i = start; i < code.length; i++) {
            if (/[\s]/.test(code[i]) || code[i] == ';' || code[i] == '(' || code[i] == ',' || code[i] == '{' || code[i] == ":") {
                if (wordStart != -1) {
                    wordEnd = i;
                    break;
                }
            } else if (!/[\s]/.test(code[i]) && wordStart == -1) {
                wordStart = i;
            }
        }

        if (wordStart == -1)
            return null;

        if (wordEnd == -1)
            wordEnd = code.length;

        return {
            value: code.substring(wordStart, wordEnd),
            start: wordStart,
            end: wordEnd
        };

    };

    var getNextValidCharacter = function (code, start) {
        for (var i = start; i < code.length; i++) {
            if (!/[\s]/.test(code[i]))
                return {
                    value: code[i],
                    index: i
                };
        }
        return null;
    }
    var getLastValidCharacter = function (code, start) {
        for (var i = start; i >= 0; i--) {
            if (!/[\s]/.test(code[i]))
                return {
                    value: code[i],
                    index: i
                };
        }
        return null;
    }
    var matchIndex = function (text, re) {
        var res = [];
        var subs = text.match(re);
        if (subs == null)
            return null;
        for (var cursor = subs.index, l = subs.length, i = 1; i < l; i++) {
            var index = cursor;

            if (i + 1 !== l && subs[i] !== subs[i + 1]) {
                nextIndex = text.indexOf(subs[i + 1], cursor);
                while (true) {
                    currentIndex = text.indexOf(subs[i], index);
                    if (currentIndex !== -1 && currentIndex <= nextIndex)
                        index = currentIndex + 1;
                    else
                        break;
                }
                index--;
            } else {
                index = text.indexOf(subs[i], cursor);
            }
            cursor = index + subs[i].length;

            res.push([subs[i], index]);
        }
        return res;
    }
    var mergeMethods = function (methods, type, code) {
		type = type || {};
		
        if (!methods || methods.length < 1)
            return null;
        var first = methods[0];
        var numberOfParametersAlreadyUsed = [];
        var newBody = '';
		first.decorators = first.decorators || [];
		

        var greaterParameter = 0;
        for (var i in methods) {
            var method = methods[i];
            if (method.value.parameters.length > greaterParameter)
                greaterParameter = method.value.parameters.length;
			if(method.decorators){
				for(var i in method.decorators){
					if(indexOf(first.decorators, method.decorators[i]) == -1)
						first.decorators.push(method.decorators[i]);
				}
			}
        }

        methods.sort(function (a, b) {
            return a.value.parameters.length - b.value.parameters.length;
        });
        var restParameterMethodParameters = null;

        for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            var returnTypes = method.value.returnType.split('|');
            for (var j = 0; j < returnTypes.length; j++)
                returnTypes[i] = trim(returnTypes[i]);

            if (method.modifier != first.modifier || indexOf(numberOfParametersAlreadyUsed, method.value.parameters.length) != -1) {
				throwLineError(code, method.codeIndex, "Functions with the same name must have the same modifier and different amount of parameters", method);
            }
            var parameters = '';

            var validations = "";
            var restParameter = null;
            for (var k = 0; k < method.value.parameters.length; k++) {
                if (restParameter != null)
					throwLineError(code, method.codeIndex, "Rest parameter must be last formal parameter", method);
				
                if (parameters != '')
                    parameters += ", ";
                var parameter = trim(method.value.parameters[k]);

                var nameAndType = parameter.split(':');

                var types = null;
                if (nameAndType.length > 1) {
                    parameter = nameAndType[0];
                    method.value.parameters[k] = parameter;
                    types = nameAndType[1].split('|');

                    var validation = getFullValidationForTypes(types, parameter, false, false, method.name, type.name);
                    if (validation) {
                        validations += "\n" + validation;
                    }
                }

                if (parameter.indexOf("...") == 0) {
                    parameter = parameter.substr(3);
                    method.value.parameters[k] = parameter;
                    restParameterMethodParameters = method.value.parameters;
                    restParameter = "\n		" + parameter + "	=	Array.prototype.slice.call(arguments, " + k + ");";
                }
                parameters += parameter;
            }

            if (methods.length > 1) {
                if (restParameter != null)
                    newBody += "if(arguments.length >= " + method.value.parameters.length + "){";
                else
                    newBody += "if(arguments.length == " + method.value.parameters.length + "){";
            }
            newBody += "\n  var  z____return = ("+(method.isAsync ? "async " : "")+(method.isGenerator ? "* " : "")+"function " + method.name + "(" + parameters + "){";
            if (restParameter != null)
                newBody += restParameter;
            if (validations)
                newBody += "\n" + validations + "\n";
            if (type)
                newBody += "\n        " + replacePrivatesAndSuper(method.value.body, type, method.name, method.isStatic);
            else
                newBody += "\n        " + method.value.body;

            newBody += "}).apply(typeof ___self___ == 'undefined' ? this : ___self___, arguments);\n";
            var typeName = type ? type.name : null;
            var returnValidation = getFullValidationForTypes(returnTypes, "z____return", false, true, method.name, typeName);
            if (returnValidation)
                newBody += "\n" + returnValidation + "\n";
            newBody += "return z____return;";
            if (methods.length > 1)
                newBody += "}\n";
        }
        if (methods.length > 1) {
            first.value.parameters = [];
			if(first.className)
				newBody += "throw '" +first.className+"#" + first.name + " - No overload function takes '+arguments.length+' arguments';"
			else
				newBody += "throw '" + first.name + " - No overload function takes '+arguments.length+' arguments';"
        }
        if (restParameterMethodParameters != null && restParameterMethodParameters.length < greaterParameter) {
            throw 'Function overload with rest parameter should have the largest number of parameters';
        }
        first.value.body = newBody;
        return first;
    };
    var replaceSuper = function (code, type, actualMethod) {
        var base = type.base;
        code = code.replace(/([\s]?super[\s]?\.)([^0-9][\w]*[\s]*)(\([^)]*\))/gi, function ($0, $1, $2, $3) {
            var parameters = $3.substr(1, $3.length - 2);
			
            if (trim(parameters).length > 0)
                return " ___super___." + $2 + ".call(this," + parameters + ")";
            return " ___super___." + $2 + ".call(this)";
        });
        code = code.replace(/([\s]?super[\s]?\.)([^0-9][\w]*[\s]*)/gi, function ($0, $1, $2, $3) {
            return " ___super___." + $2;
        });
        if (actualMethod) {
            code = code.replace(/([\s]?super[\s]*)(\([^)]*\))/gi, function ($0, $1, $2) {
                var parameters = $2.substr(1, $2.length - 2);
                if (actualMethod == "constructor") {
                    if (trim(parameters).length > 0)
                        return " if(typeof " + base + " != 'undefined') __callSuperConstructor__.call(this," + parameters + ")";
                    return " if(typeof " + base + " != 'undefined') __callSuperConstructor__.call(this)";
                } else {
                    if (trim(parameters).length > 0)
                        return " ___super___." + actualMethod + ".call(this," + parameters + ")";
                    return " ___super___." + actualMethod + ".call(this)";
                }

            });
            if (actualMethod == "constructor") {
                code = code.replace(/([\s]?this[\s]*)(\([^)]*\))/gi, function ($0, $1, $2) {
                    var parameters = $2.substr(1, $2.length - 2);
                    if (trim(parameters).length > 0)
                        return " __callThisConstructor__.call(this," + parameters + ")";
                    return " __callThisConstructor__.call(this)";
                });
            }
        }
        return code;
    }

    var replacePrivatesAndSuper = function (code, type, method, isStatic) {
        isStatic = isStatic || false;
        var privateStatics = [];
        var privates = [];
        for (var i in type.fields) {
            var field = type.fields[i];

            if (field.modifier == "private") {
                if (field.isStatic) {
                    privateStatics.push(trim(field.name));
                } else if (!isStatic) {
                    privates.push(trim(field.name));
                }
            }
        }

        for (var i in type.properties) {
            var field = type.properties[i];

            if (field.modifier == "private") {
                if (field.isStatic) {
                    privateStatics.push(trim(field.name));
                } else if (!isStatic) {
                    privates.push(trim(field.name));
                }
            }
        }

        for (var i in type.methods) {
            var field = type.methods[i];

			if (field.modifier == "private") {
                if (field.isStatic) {
                    privateStatics.push(trim(field.name));
                } else if (!isStatic) {
                    privates.push(trim(field.name));
                }
            }
        }

        for (var i in type.subTypes) {
            var field = type.subTypes[i];

            if (field.modifier == "private") {
                if (field.isStatic) {
                    privateStatics.push(trim(field.name));
                } else if (!isStatic) {
                    privates.push(trim(field.name));
                }
            }
        }

        var codeParts = [];
        var index = 0;

        do {
            var codePart = code.substr(index);
            var indexes = matchIndex(codePart, /([\s]?function[\s]?)(\([^)]*\))([\s]?\{[\s]?)/);
            if (indexes != null && indexes.length > 0) {
                //este código esta dentro do escopo
                codeParts.push({
                    value: codePart.substring(0, indexes[2][1]),
                    canProcess: true
                });
                //esse código esta fora do escopo
                var bracesIndex = getNextBraceStartEnd(codePart, indexes[2][1]);
                if (bracesIndex == null)
					throwLineError(codePart, indexes[2][1], "Syntax error } expected", type);
                codeParts.push({
                    value: codePart.substring(indexes[2][1], bracesIndex[1] + 1),
                    canProcess: false
                });
                index = bracesIndex[1] + 1 + index;
            }
            else {
                codeParts.push({
                    value: codePart,
                    canProcess: true
                });
                break;
            }
        } while (codeParts.length < 10);


        var newCode = "";
        for (var i in codeParts) {
            if (codeParts[i].canProcess) {
                if (!isStatic)
                    codeParts[i].value = replaceSuper(codeParts[i].value, type, method);
                if (privates.length > 0) {
                    //substitui privados
                    codeParts[i].value = codeParts[i].value.replace(/([\s]?this[\s]?\.)([^0-9][\w]*[\s]*)(\(|[\s|+|-|*|\/|~|^|,]|\;|\.|\)|\[)/gi, function ($0, $1, $2, $3) {
                        var name = trim($2);
                        if (indexOf(privates, name) == -1)
                            return $0;
                        return " ___private___." + $2 + $3;
                    });
                }
                if (privateStatics.length > 0) {
                    //substitui privados statics
                    var regex = new RegExp("([\\s]?" + escapeRegExp(type.name) + "[\\s]?\\.)([^0-9][\\w]*[\\s]*)(\\(|[\\s|+|-|*|\\/|~|^|,]|\\;|\\.|\\)|\\[)", "gi");
                    codeParts[i].value = codeParts[i].value.replace(regex, function ($0, $1, $2, $3) {
                        var name = trim($2);
                        if (indexOf(privateStatics, name) == -1)
                            return $0;
                        return " ___privateStatic___." + $2 + $3;
                    });
                }
            }
            newCode += codeParts[i].value;
        }

        return newCode;
    };
    var escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    var compileType = function (code, type) {

        var script = 'var ' + type.name + ' = (function(' + ((type.base != null) ? type.base : '') + '){\n"use strict";\n';
        script += "\nvar ___privateStatic___ = {};\n";

        script += 'function ' + type.name + '(';

        //transforma fields tipados em properties
        var generatedPropertyFieldPrefix = "z____";
        var filteredFields = [];
        for (var i in type.fields) {
            var field = type.fields[i];

            var nameAndType = field.name.split(':');

            if (nameAndType.length == 1) {
                filteredFields.push(field);
            }
            else {
                var filteredContext = field.isStatic ? type.name : "this";
				
				if(field.value == "" || field.value == "undefined"){
					var defaultValue = typesDefaultValues[trim(nameAndType[1])]
					if(defaultValue == undefined){
						defaultValue = "null";
					}
					field.value = defaultValue;
				}
				
                filteredFields.push({
                    name: generatedPropertyFieldPrefix + nameAndType[0],
                    modifier: "private",
                    isStatic: field.isStatic,
                    isGet: false,
                    isSet: false,
                    isMethod: false,
                    isSubClass: false,
                    value: field.value,
					codeIndex: field.codeIndex,
					className: type.name
                });
                type.properties.push({
                    name: nameAndType[0],
                    modifier: field.modifier,
                    isStatic: field.isStatic,
                    isGet: true,
                    isSet: false,
                    isMethod: true,
                    isSubClass: false,
                    value: {
                        body: "return " + filteredContext + "." + generatedPropertyFieldPrefix + nameAndType[0] + ";",
                        parameters: [],
                        returnType: nameAndType[1]
                    },
					decorators: field.decorators,
					codeIndex: field.codeIndex,
					className: type.name

                });
                type.properties.push({
                    name: nameAndType[0],
                    modifier: field.modifier,
                    isStatic: field.isStatic,
                    isGet: false,
                    isSet: true,
                    isMethod: true,
                    isSubClass: false,
                    value: {
                        body: filteredContext + "." + generatedPropertyFieldPrefix + nameAndType[0] + " = value;",
                        parameters: ["value:" + nameAndType[1]]
                    },
					codeIndex: field.codeIndex,
					className: type.name
                });

            }

        }
        type.fields = filteredFields;

        var methodGroupByName = {};
        var constructors = [];
        for (var i in type.methods) {
            if (type.methods[i].name == "constructor") {
                type.methods[i].value.returnType = "any";
                constructors.push(type.methods[i]);
            } else {
                var key = type.methods[i].isStatic + "_" + trim(type.methods[i].name);
                if (typeof methodGroupByName[key] == "undefined")
                    methodGroupByName[key] = [];

                methodGroupByName[key].push(type.methods[i]);
            }
        }

        //Inicio Constructor
        if (constructors.length == 0) {
            constructors.push({
                name: "constructor",
                modifier: "public",
                isStatic: false,
                isGet: false,
                isSet: false,
                isMethod: true,
                isSubClass: false,
                value: {
                    body: type.base != null ? "    super();" : "",
                    parameters: [],
                    returnType: "any"
                },
				className: type.name,
				codeIndex: type.codeIndex,
            });
        }
        var constructor = mergeMethods(constructors, type, code);
        if (constructor.isStatic || constructor.modifier != "public"){
			throwLineError(code, constructor.codeIndex, "Constructors should be public and can not be static", constructor);
		}
        var parameters = '';
        for (var i in constructor.value.parameters) {
            if (parameters != '')
                parameters += ", ";
            parameters += constructor.value.parameters[i];
        }
        var publicStatics = '';
        //Fim do constructor
        script += parameters + "){\n"; //Inicio da classe

        //class check
        script += '\tJSComet.checkClass(this, ' + type.name + ');\n';

        script += '\tvar ___private___ = {};\n';
        script += '\tvar ___self___ = this;\n';
        if (type.base != null)
        {
          script += '\tvar ___super___ = null;\n';
        }
        script += '\n\tvar __callSuperConstructor__ = function(){\n';

        if (type.base != null)
        {
          //super call (can only pass parameters of the constructors)
          script += '\n\t\t'+ type.base +'.apply(___self___, arguments);';
          //make super obj
          script += '\n\t\t___super___ = JSComet.wrapSuper(___self___);';
        }
        script += '\n\t\t___defineAllProperties___.call(___self___);';
        //End super call
        script += '\n\t}\n';

        //Define all properties and methods
       script += '\n\t\tvar ___defineAllProperties___ = function(){\n';

				//Inicio das Properties
                
				//chama decorators da classe quando instanciada
				if(type.decorators)
					for(var i in type.decorators){
						script += "\n\t" + type.decorators[i].substring(1) + "(___self___, " + type.name + ", "+((type.base != null) ?  type.base : "null")+");\n"
					}

                //Separa properties em get e set
                var properties = {};
                for (var i in type.properties) {
                    var prop = type.properties[i];
                    var key = prop.isStatic + "_" + trim(prop.name);

                    if (typeof properties[key] == "undefined")
                        properties[key] = {};

                    if (prop.isGet)
                        properties[key].get = prop;
                    else
                        properties[key].set = prop;
                }

                for (var i in properties) {
                    var prop = properties[i];

                    if (!prop.get) {
                        prop.get = {
                            name: prop.set.name,
                            value: {
                                body: " throw '"+type.name+"#"+prop.set.name+" - this property is writeonly';",
                                parameters: []
                            },
                            modifier: prop.set.modifier,
                            isStatic: prop.set.isStatic
                        };
                    }

                    if (!prop.set) {
                        prop.set = {
                            name: prop.get.name,
                            value: {
								body: " throw '"+type.name+"#"+prop.get.name+" - this property is readonly';",
                                parameters: ["value"]
                            },
                            modifier: prop.get.modifier,
                            isStatic: prop.get.isStatic
                        };
                    }

                    var getFunc = "";
                    var setFunc = "";
                    var setParameter = prop.set.value.parameters.length < 1 ? "value" : prop.set.value.parameters[0];

                    var nameAndType = setParameter.split(':');

                    var types = null;
                    var validation = null;
                    if (nameAndType.length > 1) {
                        setParameter = nameAndType[0];
                        types = nameAndType[1].split('|');
                        validation = getFullValidationForTypes(types, setParameter, true, false, prop.get.name, type.name);
                    }
                    if (!validation)
                        validation = "";

                    var returnValidation = null;
                    if (!prop.get.value.returnType)
                        prop.get.value.returnType = "any";

                    var returnTypes = prop.get.value.returnType.split('|');
                    for (var j = 0; j < returnTypes.length; j++)
                        returnTypes[i] = trim(returnTypes[i]);
                    returnValidation = getFullValidationForTypes(returnTypes, "z____return", false, true, prop.get.name, type.name);
                    if (returnValidation)
                        returnValidation = returnValidation + "\n"
        			      else
        				        returnValidation = "";

                    var privateName = prop.get.isStatic ? '___privateStatic___' : '___private___';
                    var publicName = prop.get.isStatic ? type.name : '___self___';

                    var defaultGet = "";
                    var defaultSet = "";
                    getFunc = "(function " + prop.get.name + "(){" + replacePrivatesAndSuper(prop.get.value.body, type, null, prop.get.isStatic) + "})";
                    setFunc = "(function " + prop.set.name + "(" + setParameter + "){\n" + validation + "\n" + replacePrivatesAndSuper(prop.set.value.body, type, null, prop.set.isStatic) + " })";
                    getFunc = "(function(){ var z____return = " + getFunc + ".apply(" + publicName + ", arguments);\n " + returnValidation + " return z____return;})";
                    setFunc = "(function(){ return " + setFunc + ".apply("+publicName + ", arguments);})";


                    var propertyCode = "";
                    var propertyBody = ", { enumerable: false, key: '" + prop.get.name + "', get: " + getFunc + ", set:" + setFunc + " });\n";
                    if (prop.get.modifier == "public") {
                        if (prop.set.modifier != "public") {
                            propertyCode += "\nJSComet.defineProperty(" + privateName + propertyBody;
                            setFunc = defaultSet;
                        }
                        propertyCode += "\nJSComet.defineProperty(" + publicName + propertyBody;
                    } else {
                        if (prop.set.modifier == "public") {
                            propertyCode += "\nJSComet.defineProperty(" + publicName + propertyBody;
                        }
                        propertyCode += "\nJSComet.defineProperty(" + privateName + propertyBody;
                    }
					prop.get.decorators = prop.get.decorators || [];
					if(prop.set.decorators)
						for(var i in prop.set.decorators){
							if(indexOf(prop.get.decorators, prop.set.decorators[i]) == -1)
								prop.get.decorators.push(prop.set.decorators.decorators[i]);
						}
	
					if(prop.get.decorators)
						for(var i in prop.get.decorators){
							var decoratorsFormat = "(function($super){\t\nvar desc = Object.getOwnPropertyDescriptor(this || "+type.name+", '" + prop.get.name +"');\n"; 
							if(type.base != null)
								decoratorsFormat +=  "\t\n var superDescriptor = Object.getOwnPropertyDescriptor($super || "+type.base + ", '" +prop.get.name +"');\n";
							else
								decoratorsFormat +=  "\t\n var superDescriptor = null;\n";
							decoratorsFormat +=  "\t\n desc =" + prop.get.decorators[i].substring(1) + "(this, '" + prop.get.name +"', desc, superDescriptor) || desc;\n";
							decoratorsFormat += "\t\nObject.defineProperty(this || "+type.name+", '" + prop.get.name +"', desc);\n"
							if(prop.get.isStatic)
								decoratorsFormat += "}).call(null);\n"; 
							else
								decoratorsFormat += "}).call(this" + ((type.base != null) ? ", ___super___" : "") + ");\n"; 
							propertyCode += decoratorsFormat;
						}
					
                    if(prop.get.isStatic)
                      publicStatics += propertyCode;
                    else
                      script += propertyCode;
                }//Fim das Properties

                //Define non-statics Fields
                for (var i in type.fields) {
                    var field = type.fields[i];

                    if (!field.isStatic) {
                        if (field.modifier == "public")
                            script += "\n\t\tthis.";
                        else
                            script += "\n\t\t___private___.";

                        script += field.name + " = " + field.value + ";";
						if(field.decorators)
							for(var i in field.decorators){
								var decoratorsFormat = "(function($super){\t\nvar desc = Object.getOwnPropertyDescriptor(this || "+type.name+", '" + field.name +"');\n"; 
								if(type.base != null)
									decoratorsFormat +=  "\t\n var superDescriptor = Object.getOwnPropertyDescriptor($super || "+type.base + ", '" +field.name +"');\n";
								else
									decoratorsFormat +=  "\t\n var superDescriptor = null;\n";
							
								decoratorsFormat +=  "\t\ndesc =" + field.decorators[i].substring(1) + "(this, '" + field.name +"', desc) || desc;\n";
								decoratorsFormat += "\t\nObject.defineProperty(this || "+type.name+", '" + field.name +"', desc);\n"
								if (field.modifier == "public")
									decoratorsFormat += "}).call(this" + ((type.base != null) ? ", ___super___" : "") + ");\n"; 
								else
									decoratorsFormat += "}).call(___private___" + ((type.base != null) ? ", ___super___" : "") + ");\n"; 
								script += decoratorsFormat;
							}
                    }
                }
                //Inicio dos Métodos
                for (var i in methodGroupByName) {
                    var method = mergeMethods(methodGroupByName[i], type, code);
                    if (!method)
                        continue;
                    var methodCode = " (function " + method.name + "(" + method.value.parameters.join(", ") + "){" + replacePrivatesAndSuper(method.value.body, type, method.name, method.isStatic) + "})";

                    if (method.modifier == "private")
                        methodCode = " (function " + method.name + "(" + method.value.parameters.join(", ") + "){ return " + methodCode + ".apply(this, arguments);})";

                    if (method.isStatic) {
                        if (method.modifier == "private") {
                            publicStatics += "\n___privateStatic___." + method.name + " = " + methodCode + ";";
                        } else
                            publicStatics += "\n" + type.name + "." + method.name + " = " + methodCode + ";";
                    } else {
                        if (method.modifier == "private") {
                            script += "\n___private___." + method.name + " = " + methodCode + ";";
                        } else
                            script += "\n___self___." + method.name + " = " + methodCode + ";";
                    }
					if(method.decorators)
						for(var i in method.decorators){
							var decoratorsFormat = "(function($super){\t\nvar desc = Object.getOwnPropertyDescriptor(this || "+type.name+", '" + method.name +"');\n"; 
							if(type.base != null)
								decoratorsFormat +=  "\t\n var superDescriptor = Object.getOwnPropertyDescriptor($super || "+type.base + ", '" +method.name +"');\n";
							else
								decoratorsFormat +=  "\t\n var superDescriptor = null;\n";
							decoratorsFormat +=  "\t\ndesc =" + method.decorators[i].substring(1) + "(this, '" + method.name +"', desc) || desc;\n";
							decoratorsFormat += "\t\nObject.defineProperty(this || "+type.name+", '" + method.name +"', desc);\n"
							
							if (method.isStatic){
								if (method.modifier == "public")
									decoratorsFormat += "}).call(null);\n"; 
								else
									decoratorsFormat += "}).call(___privateStatic___);\n"; 
								publicStatics += decoratorsFormat;
							}else{
								if (method.modifier == "public")
									decoratorsFormat += "}).call(___self___" + ((type.base != null) ? ", ___super___" : "") + ");\n"; 
								else
									decoratorsFormat += "}).call(___private___" + ((type.base != null) ? ", ___super___" : "") + ");\n"; 
								script += decoratorsFormat;
							}
						
					  }
                }
                //Fim dos Métodos

        //End Define all properties and methods
        script += '\n\t\t};';
        if (type.base == null)
        {
          script += '___defineAllProperties___.call(___self___);';
        }
        //constructor call
    		script +='\n\tvar __callThisConstructor__ = function (){';
        script += '\n\t\t(function(){\n';
        script += replacePrivatesAndSuper(constructor.value.body, type, 'constructor', false); //Constructor
        script += '\n\t\t}).apply(___self___, arguments);\n';
        script += '\n\t};\n';
        script += 'return __callThisConstructor__.apply(___self___, arguments);';
        script += "}"//fim da classe


        //Inicio dos Fields statics
        for (var i in type.fields) {
            var field = type.fields[i];

            if (field.isStatic) {
                if (field.modifier == "public") {
                    publicStatics += "\n" + type.name + "." + field.name + " = " + field.value + ";";
                }
                else {
                    publicStatics += "\n___privateStatic___." + field.name + " = " + field.value + ";";
                }
				if(field.decorators)
					for(var i in field.decorators){
						var decoratorsFormat = "(function(){\t\nvar desc = Object.getOwnPropertyDescriptor("+type.name+", '" + field.name +"');\n"; 
						if(type.base != null)
							decoratorsFormat +=  "\t\n var superDescriptor = Object.getOwnPropertyDescriptor("+type.base + ", '" +field.name +"');\n";
						else
							decoratorsFormat +=  "\t\n var superDescriptor = null;\n";
						decoratorsFormat +=  "\t\ndesc =" + field.decorators[i].substring(1) + "(this, '" + field.name +"', desc) || desc;\n";
						decoratorsFormat += "\t\nObject.defineProperty(this || "+type.name+", '" + field.name +"', desc);\n"
						if (field.modifier == "public")
							decoratorsFormat += "}).apply(null);\n"; 
						else
							decoratorsFormat += "}).apply(___privateStatic___);\n"; 
						publicStatics += decoratorsFormat;
					}

            }
        }//Fim dos Fields

        //Adiciona Statics publicos/privates
        script += "\n" + publicStatics;

        for (var i in type.subTypes) {
            var subType = type.subTypes[i];

            if (subType.modifier == "private") {
                script += "\n___privateStatic___." + subType.value.substr(3);
            } else
                script += "\n" + type.name + "." + subType.value.substr(3);
			
			if(subType.decorators)
				for(var i in subType.decorators){
					var decoratorsFormat = "(function(){\t\nvar desc = Object.getOwnPropertyDescriptor("+type.name+", '" + subType.name +"');\n"; 
					if(type.base != null)
						decoratorsFormat +=  "\t\n var superDescriptor = Object.getOwnPropertyDescriptor("+type.base + ", '" +subType.name +"');\n";
					else
						decoratorsFormat +=  "\t\n var superDescriptor = null;\n";
					
					decoratorsFormat +=  "\t\ndesc = " + sybType.decorators[i].substring(1) + "(this, '" + subType.name +"', desc) || desc;\n";
					decoratorsFormat += "\t\nObject.defineProperty(this || "+type.name+", '" + subType.name +"', desc);\n"
					if (subType.modifier == "public")
						decoratorsFormat += "}).apply(null);\n"; 
					else
						decoratorsFormat += "}).apply(___privateStatic___);\n"; 
					script += decoratorsFormat;
				}
        }

        if(type.base != null){
          //inherits
      	   script += '\nJSComet.inherits(' + type.name + ', ' + type.base + ');\n';
        }
        script += "\nreturn " + type.name + ";\n})(" + ((type.base != null) ? type.base : '') + ");";

        return script;
    };
    this.translateImports = function (code, isLibrary) {
        var nextImport = -1;
        do {

            var importConfig = null;
            var importFile = null;
            nextImport = getNextWordStart(code, 0, 'import');

            if (nextImport == -1)
                break;

            var line = getRemainingLine(code, nextImport);
			line.value = line.value.substr(6);
            bodyIndex = 0;

            function verifyMultipleImport() {
                nextCharacter = getNextValidCharacter(line.value, bodyIndex);

                if (nextCharacter == null)
					throwLineError(code, bodyIndex, "Syntax error invalid import");

                if (nextCharacter.value == "{") { //export { Greet, Greeter as G }
                    var elementBraceIndexes = getNextBraceStartEnd(line.value, nextCharacter.index);
                    if (elementBraceIndexes == null)
						throwLineError(line.value, bodyIndex, "Syntax error expected } in import");

                    bodyIndex = elementBraceIndexes[1] + 1;
                    var elements = trim(line.value.substring(elementBraceIndexes[0] + 1, elementBraceIndexes[1]));
                    if (!elements)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");
                    bodyIndex = elementBraceIndexes[1] + 1;
                    elements = elements.split(',');

                    for (var i = 0; i < elements.length; i++) {

                        var element = elements[i];
                        if (!element)
                           throwLineError(line.value, bodyIndex, "Syntax error invalid import");
                        var name = null;
                        var importName = null;
                        var aliasStart = getNextWordStart(element, 0, 'as');
                        if (aliasStart == -1) {
                            importName = element;
                            name = element;
                        } else {
                            importName = element.substr(aliasStart + 2);
                            name = element.substring(0, aliasStart);
                        }
                        importName = trim(importName);
                        name = trim(name);
                        if (!importName || !name)
                            throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                        importConfig = importConfig || {};
                        importConfig[name] = importName;
                    }
                    return true;
                }
                return false;
            }


            if (verifyMultipleImport()) {
                var fromPart = getNextWordStart(line.value, bodyIndex, "from");
                if (fromPart == -1)
                    throwLineError(line.value, bodyIndex, "Syntax error invalid import expected from");
                bodyIndex = fromPart + 5;
                var file = getRemainingLine(line.value, bodyIndex);
                importFile = file.value;
            } else {
                if (nextCharacter.value == '"' || nextCharacter.value == "'") {
                    var file = getRemainingLine(line.value, bodyIndex);
                    importFile = file.value;
                } else if (nextCharacter.value == "*") {
                    bodyIndex = nextCharacter.index;

                    nextCharacter = getNextValidCharacter(line.value, bodyIndex);
                    if (nextCharacter == null)
						throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    if (nextCharacter.value == ",")
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    if (nextCharacter.value == "{")
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    var defaultAlias = getNextWordStart(line.value, bodyIndex, 'as');
                    if (defaultAlias == -1)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import expected as");

                    bodyIndex = defaultAlias + 2;
                    var importName = getNextWord(line.value, bodyIndex);
                    if (importName == null)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    bodyIndex = importName.end + 1;
                    importName = trim(importName.value);
                    var name = "*";
                    if (!importName || !name)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    importConfig = importConfig || {};
                    importConfig[name] = importName;
                } else {
                    var importName = getNextWord(line.value, bodyIndex);
                    if (importName == null)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    bodyIndex = importName.end;
                    importName = trim(importName.value);
                    var name = "default";
                    if (!importName || !name)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");

                    importConfig = importConfig || {};
                    importConfig[name] = importName;
                }
                if (!importFile) {
                    nextCharacter = getNextValidCharacter(line.value, bodyIndex);
                    if (nextCharacter == null)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");
                    if (nextCharacter.value == ",") {
                        bodyIndex = nextCharacter.index + 1;
                        if (!verifyMultipleImport())
                            throwLineError(line.value, bodyIndex, "Syntax error invalid import");
                    }
                    var fromPart = getNextWordStart(line.value, bodyIndex, "from");
                    if (fromPart == -1)
                        throwLineError(line.value, bodyIndex, "Syntax error invalid import");
                    bodyIndex = fromPart + 5;
                    var file = getRemainingLine(line.value, bodyIndex);
                    importFile = file.value;
                }
            }

            importFile = trim(importFile);
            if (!importFile)
				throwLineError(line.value, bodyIndex, "Syntax error invalid import");

            if (importFile[importFile.length - 1] == ";")
                importFile = importFile.substr(0, importFile.length - 1);
            if (!importFile)
                throwLineError(line.value, bodyIndex, "Syntax error invalid import");

            var newCode = code.substring(0, nextImport);
            var translateCodeAfterImport = this.options['translateCodeAfterImport'] !== false ? "true" : "false";
			
			if(isLibrary === true)
				newCode += "\nvar ____imported = JSComet.include(" + importFile + ", " + translateCodeAfterImport + ", z____memoryImport);\n";
			else
				newCode += "\nvar ____imported = JSComet.include(" + importFile + ", " + translateCodeAfterImport + ");\n";
				
			if (importConfig) {
				for (var i in importConfig) {
					var exportName = importConfig[i];
					var name = i;
					if (name == "*") {
						newCode += "\nvar " + exportName + " = ____imported;";
					} else {
						newCode += "\nvar " + exportName + " = ____imported." + name + ";";
					}
				}
				//newCode += "\ndelete imported;";
			}
            newCode += code.substring(line.end);
            code = newCode;
        } while (true);

        return code;
    };
    this.translateExports = function (moduleName, code, allowDefault) {
        allowDefault = allowDefault || false;
        var moduleBody = code;
        var nextExport = -1;
        do {
            var exports = [];
            nextExport = getNextWordStart(moduleBody, 0, 'export');

            if (nextExport == -1)
                break;
            var endExport = nextExport + 6;
            var bodyIndex = 0;

            function parseExport() {
                bodyIndex = nextExport + 7;
                var exportElement = {
                    name: null,
                    exportName: null,
                    isDefault: false,
                    remove: false
                };
                var nextCharacter = null;

                function verifyMultipleExport() {
                    nextCharacter = getNextValidCharacter(moduleBody, bodyIndex);

                    if (nextCharacter == null)
						throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                    if (nextCharacter.value == "{") { //export { Greet, Greeter as G }
                        var elementBraceIndexes = getNextBraceStartEnd(moduleBody, nextCharacter.index);
                        if (elementBraceIndexes == null)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export expected }");

                        bodyIndex = elementBraceIndexes[1] + 1;
                        var elements = trim(moduleBody.substring(elementBraceIndexes[0] + 1, elementBraceIndexes[1]));
                        if (!elements)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                        bodyIndex = elementBraceIndexes[1] + 1;
                        elements = elements.split(',');

                        for (var i = 0; i < elements.length; i++) {
                            exportElement = {
                                isDefault: exportElement.isDefault,
                                remove: true
                            };

                            var element = elements[i];
                            if (!element)
								throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                            var aliasStart = getNextWordStart(element, 0, 'as');
                            if (aliasStart == -1) {
                                exportElement.exportName = element;
                                exportElement.name = element;
                            } else {
                                exportElement.exportName = element.substr(aliasStart + 2);
                                exportElement.name = element.substring(0, aliasStart);
                            }

                            if (!exportElement.exportName || !exportElement.name)
                                throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                            exports.push(exportElement);
                        }
                        return true;
                    }
                    return false;
                }
                if (verifyMultipleExport())
                    return;

                var nextWord = getNextWord(moduleBody, bodyIndex);
                if (nextWord == null)
                    throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                if (nextWord.value == "default") {
                    bodyIndex = nextWord.end;
                    endExport = bodyIndex;
                    exportElement.isDefault = true;
                    if (verifyMultipleExport())
                        return;

                    nextWord = getNextWord(moduleBody, bodyIndex);
                    if (nextWord == null)
                        throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                    bodyIndex = nextWord.end;
                }

                switch (nextWord.value) {
                    case "var":
                    case "let":
                    case "const":
                        bodyIndex = nextWord.end;
                        nextWord = getNextWord(moduleBody, bodyIndex);
                        if (nextWord == null)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                        exportElement.name = nextWord.value;
                        exportElement.exportName = exportElement.name;

                        var equalsIndex = getNextValidCharacter(moduleBody, nextWord.end);
                        if (equalsIndex == null || equalsIndex.value != "=")
							throwLineError(moduleBody, bodyIndex, "Syntax error = expected in export");
						
                        var line = getRemainingLine(moduleBody, equalsIndex.index + 1);
                        bodyIndex = line.end + 1;

                        exports.push(exportElement);
                        break;
					case "async":
						nextWord = getNextWord(moduleBody, bodyIndex);
						if (nextWord == null || nextWord.value != "function")
							throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                    case "class":
                    case "function":
                    case "module":
                        bodyIndex = nextWord.end;
                        nextCharacter = getNextValidCharacter(moduleBody, bodyIndex);
                        if (nextCharacter == null)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                        if (nextCharacter.value == "(" || nextCharacter.value == "{")
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                        nextWord = getNextWord(moduleBody, bodyIndex);
                        if (nextWord == null)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");

                        exportElement.name = nextWord.value;
                        exportElement.exportName = nextWord.value;

                        var exportBracesIndexes = getNextBraceStartEnd(moduleBody, bodyIndex);
                        if (exportBracesIndexes == null)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                        bodyIndex = exportBracesIndexes[1] + 1;
                        exports.push(exportElement);
                        break;
                    default:
                        bodyIndex = nextWord.start;
                        var line = getRemainingLine(moduleBody, nextWord.start);
                        bodyIndex = line.start;
                        exportElement.name = line.value;
                        exportElement.exportName = exportElement.name;
                        if (!exportElement.exportName || !exportElement.name)
                            throwLineError(moduleBody, bodyIndex, "Syntax error invalid export");
                        bodyIndex = line.end + 1;
                        exportElement.remove = true;
                        exports.push(exportElement);
                        break;
                }
            }


            parseExport();

            var exportCode = exports[0].remove ? "" : moduleBody.substring(endExport + 1, bodyIndex);
            if (exportCode && trim(exportCode[exportCode.length - 1]) != ";")
                exportCode += ";\n";
            //remove export tag
            var newBody = moduleBody.substring(0, nextExport) + exportCode;
            //monta exports para namespace
            for (var i = 0; i < exports.length; i++) {
                exports[i].exportName = exports[i].exportName.replace(";", '');
                exports[i].name = exports[i].name.replace(";", '');
                if (exports[0].isDefault) {
                    if (allowDefault)
                        newBody += "\n" + moduleName + "['default'] = " + exports[i].name + ";";
                    else
						throwLineError(moduleBody, bodyIndex, "An export assignment cannot be used in a namespace");
                }
                else
                    newBody += "\n" + moduleName + "." + exports[i].exportName + " = " + exports[i].name + ";";
            }
            //insere restante do código
            moduleBody = newBody + "\n" + moduleBody.substring(bodyIndex);

        } while (true);


        return moduleBody;
    }
    this.translateModule = function (code, start) {
        start = start || 0;

        var script = code.substr(start);
        var moduleStart = getNextWordStart(script, 0, 'module');
        if (moduleStart == -1)
            return code;

        var moduleBodyIndexes = getNextBraceStartEnd(script, moduleStart);
        if (moduleBodyIndexes == null)
            throwLineError(script, moduleStart, "Syntax error module body expected");

        var moduleName = trim(script.substring(moduleStart + 6, moduleBodyIndexes[0]));
        var moduleBody = trim(script.substring(moduleBodyIndexes[0] + 1, moduleBodyIndexes[1]));

        moduleBody = this.translateExports(moduleName, moduleBody, false);

        var newCode = script.substring(0, moduleStart);
        newCode += "\nvar " + moduleName + " = " + moduleName + " || {}; \n(function (" + moduleName + ") {\n";
        newCode += moduleBody;
        newCode += "\n})(" + moduleName + " || (" + moduleName + " = {}));\n";
        newCode += script.substring(moduleBodyIndexes[1] + 1);
        return this.translateModule(newCode);
    }
    this.translateArrowFunctions = function (code) {


        do {
            var arrowIndex = code.indexOf('=>');
            if (arrowIndex == -1)
                return code;

            var functionStart = arrowIndex;
            var functionEnd = arrowIndex;

            var functionCode = "function ";


            var notFound = true;
            var multiParameter = false;
            for (var i = functionStart - 1; i >= 0; i--) {
                if (!/[0-9]/.test(code[i]) &&
                    !/[a-zA-Z]/.test(code[i]) &&
                    code[i] != "$" &&
                    code[i] != "_" &&
                    !/[\s]/.test(code[i]) &&
                    code[i] != '\n' &&
                    code[i] != ':') {
                    if (code[i] == ')') {
                        multiParameter = true;
                        continue;
                    }
                    if (code[i] == "," && multiParameter) {
                        continue;
                    }
                    functionStart = i + (multiParameter ? 0 : 1);
                    notFound = false;
                    break;
                }
            }
            if (notFound) {
                throwLineError(code, arrowIndex, "Syntax error invalid arrow function");
            }
			var isAsync = false;
			var asyncWord = getLastValidCharacter(code, functionStart);
			if(asyncWord != null){
				if(asyncWord.value == "("){
					asyncWord = getLastValidCharacter(code, asyncWord.index - 1);
					
				}
				if(asyncWord != null){						
					var lastWord = asyncWord.value;
					for(var i = 1; i < 5; i++){
						var wi = asyncWord.index - i;
						if(wi >= 0 && wi < code.length)
							lastWord = code[asyncWord.index - i] + lastWord;
					}
					isAsync = lastWord == "async";
				}
			}
            var header = trim(code.substring(functionStart, arrowIndex));
            if (header == "")
				throwLineError(code, arrowIndex, "Syntax error invalid arrow function");

            if (multiParameter) {
                header = trim(header).substring(1, header.length - 1);
            }
            functionCode += "(" + header + ")";
            var body = getRemainingLine(code, arrowIndex + 2);
			
            body.value = trim(body.value);
            if (body.value.indexOf("{") == 0) {
                functionCode += body.value;
            } else {
                functionCode += "{\n    return " + body.value + ";}";
            }
            functionEnd = body.end;
            if (functionCode[functionCode.length - 1] == ";")
                functionCode = functionCode.substr(0, functionCode.length - 1);
			if(asyncWord != null && isAsync){
				functionStart = asyncWord.index - 4;
			}
            var newCode = code.substring(0, functionStart);
			
			newCode += "((function(_this){ return (function(){return (" + (isAsync ? "async " : "" ) +  functionCode + ").apply(_this,arguments)});})(this))";
			var lastValidChar = getNextValidCharacter(code, functionEnd + 1);
			if(lastValidChar != null && /[a-zA-z]/.test(lastValidChar.value)){
				newCode += ";";
			}
            newCode += code.substring(functionEnd + 1);
			
            code = newCode + "\n";
        } while (true);

        return code;
    }
    this.translateStringTemplates = function (code) {

        var isTemplateFunction = function (index) {
            var word = getLastValidCharacter(code, index - 1);
            if (word == null || !/(_|\$|[a-zA-Z]|[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ])/.test(word.value))
                return false;

            var word = code.substring(0, word.index+1).split(/\s/).pop();
            if(trim(word) == "return")
                return false;
            return true;
        };
        code = code.replace(/`([^`]*)`/gi, function ($0, $1, $2, $3) {
            if (isInnerStringOrRegex(code, $2))
                return $0;
            //split funcional para ie7+
            var regexSplit = function (str, separator) {
                var match = str.match(RegExp(separator, 'g'));
                var notmatch = str.replace(new RegExp(separator, 'g'), '[|]').split('[|]');
                var merge = [];
                for (i in notmatch) {
                    merge.push(notmatch[i]);
                    if (match != null && match[i] != undefined) {
                        merge.push(match[i]);
                    }
                }
                return merge;
            }
            var replacement = $1.split('"').join("'").replace(/\r\n/g, '\n').split("\n").join("\\n");

            if (isTemplateFunction($2)) {
                var values = [];
                var strings = [];

                var allText = regexSplit(replacement, "(\\$\\{[^}]*\\})");

                for (var i = 0; i < allText.length; i++) {
                    if (allText[i].length == 0 || !/(\$\{([^}]*)\})/gi.test(allText[i])) {
                        strings.push(allText[i]);
                        continue;
                    }
                    allText[i] = allText[i].replace(/(\$\{([^}]*)\})/gi, function ($0, $1, $2, $3) {
                        return '(' + $2 + ')';
                    });
                    values.push(allText[i]);
                }
                return "(" + JSON.stringify(strings) + ", " + values.join(', ') + ")";
            } else {

                replacement = replacement.replace(/(\$\{([^}]*)\})/gi, function ($0, $1, $2, $3) {

                    return '"+(' + $2 + ')+"';
                });
                replacement = '"' + replacement + '"';

                if (replacement.indexOf('+""') == replacement.length - 3) {
                    replacement = replacement.substr(0, replacement.length - 3);
                }

                if (replacement.indexOf('""+') == 0) {
                    replacement = replacement.substr(3);
                }

                return replacement;
            }
        });
        return code;
    }
    this.translateLetAndConst = function (code) {
        return code.replace(/[\s]*(let|const)[\s]+/g, function ($0, $1, $2, $3) {
            if (isInnerStringOrRegex(code, $2))
                return $0;
            return $0.replace($1, 'var');
        });
    }
    this.translateTypedArrays = function (code) {
        return code.replace(/((?:[\s|:])(((?:[a-zA-Z]|\$|_)+(?:[a-zA-Z]|\$|_|[0-9]))\[[\s]*\]))/g, function () {
            if (isInnerStringOrRegex(code, arguments[4]))
                return arguments[0];
            var typedArray = typedArrayValidation[arguments[3]];
            return " " + (typedArray? typedArray : "Array");
        });
    }
	var buildAsyncFunctionBody = function(code, index){
		//format function
		var indexes = getNextBraceStartEnd(code, index);
		var init = code.substring(index, indexes[0]).replace("async","");
		var newFunction = init + '\n{\n\tvar z__async__context = this;\nreturn new Promise(function(z__async__result) { (function() {\n {body} \n}).apply(z__async__context); \n});\n}';
		var body = code.substring(indexes[0] + 1, indexes[1]);
		
		var nextIndex = 1;
		
		var isInMainContext = function(code, index){
			
			var nextIndex = 0;
			do{
			
				var startEnd = getNextBraceStartEnd(body, nextIndex);
				if(startEnd == null)
					return true;
				
				if(index < startEnd[0])
					return true;
				
				var lastValid = getLastValidCharacter(body, startEnd[0] - 1);
				if(lastValid == null)
					return true;
				
				//somente se for uma function
				if(lastValid.value != ")"){
					nextIndex = startEnd[1] + 1;
					
					continue;
				}else{
					
					var braceIndex = lastValid.index - 1;
					var openBraceIndex = -1;
					while(braceIndex >= 0 && braceIndex < body.length){
						if(body[braceIndex] == "("){
							openBraceIndex = braceIndex;
							break;
						}
						braceIndex--;
					}
					if(openBraceIndex == -1){
						nextIndex = startEnd[1] + 1;
						continue;
					}	
					var functionWord = getLastValidCharacter(body, openBraceIndex - 1);
					var isFunction = false;
					if(functionWord != null){
						if(functionWord.value == "("){
							functionWord = getLastValidCharacter(body, functionWord.index - 1);
							
						}
						if(functionWord != null){						
							var lastWord = functionWord.value;
							for(var i = 1; i < 8; i++){
								var wi = functionWord.index - i;
								if(wi >= 0 && wi < body.length)
									lastWord = body[functionWord.index - i] + lastWord;
							}
							isFunction = lastWord == "function";
						}
					}
					
					if(!isFunction){
						nextIndex = startEnd[1] + 1;
						continue;
					}
				}
				
				if(startEnd != null && index > startEnd[0] && index < startEnd[1]){
					nextIndex = startEnd[1] + 1;
					return false;
				}
				
				nextIndex = startEnd[1] + 1;
			}while(true);
		};
		//replace returns
		do{
			
			var nextReturn = getNextWordStart(body, nextIndex, "return");
			if(nextReturn == -1 || nextIndex > nextReturn)
				break;

			if(!isInMainContext(body, nextReturn)){
				nextIndex = nextReturn + 1;
				continue;
			}
			
			var returnLine = getRemainingLine(body, nextReturn);
			
			body = body.substring(0, returnLine.start) +  "z__async__result(" +   //inicio
			body.substring(returnLine.start + 6, returnLine.end) +  //retorno
			");\nreturn" + body.substring(returnLine.end); //fim
			nextIndex = 0;
		}while(true);
		
		var getLastCommandStart = function (code, start) {
			for (var i = start; i >= 0; i--) {
				if (code[i] == "{" || code[i] == ";")
					return {
						value: code[i],
						index: i
					};
			}
			return 0;
		};
		
		var replaceAwait = function(line, commandStart, returnResult, body){
			
			var command = body.substring(0, commandStart) + line.value.substring(5) + ".then(function(z__await__result){\n";
			command += "\n\t(function(){\n";
			var commandBody = "";
			if(returnResult)
				commandBody = body.substring(commandStart, line.start) + "z__await__result" + body.substring(line.end + 1);
			else
				commandBody = body.substring(line.end + 1);
			
			if(commandBody.indexOf(";") === 0)
			   commandBody = commandBody.substr(1);

			commandBody = replaceAllAwaits(commandBody);
			
			command += commandBody;
			command += "\n\t}).apply(z__async__context);\n";
			command +=  "});";
			return command;
		};
		
		var findAwait = function(body){
			//replace await
			var nextIndex = 0;
			do{
				
				var nextReturn = getNextWordStart(body, nextIndex, "await");
				if(nextReturn == -1 || nextIndex > nextReturn)
					return null;
				
				if(!isInMainContext(body, nextReturn)){
					nextIndex = nextReturn + 1;
					continue;
				}
				
				var returnLine = getRemainingLine(body, nextReturn);
				var lastValidCharacter = getLastValidCharacter(body, nextReturn - 1);
				var returnResult = false;
				switch(lastValidCharacter.value){
					case "[":
					case "(":
					case "=":
					case ":":
					case ",":
						returnResult = true;
						commandStart = getLastCommandStart(body, lastValidCharacter.index - 1);
						if(commandStart)
							commandStart = commandStart.index + 1;
						break;
					default:
						returnResult = false;
						commandStart = returnLine.start;
						break;
				}
				return {
					line: returnLine,
					commandStart: commandStart,
					returnResult: returnResult
				};
			}while(true);
		};
		
		var replaceAllAwaits = function(body){
			var lastAwait = null;
			do{
				lastAwait = findAwait(body);
				if(lastAwait == null)
					break;
				
				body = replaceAwait(lastAwait.line, lastAwait.commandStart, lastAwait.returnResult, body);
			}while(true);
			return body;
		};
		
		body = replaceAllAwaits(body);
		
		return newFunction.replace("{body}", body);
	};
	
	this.translateAsyncFunctions = function(code){		
		do{
		   var next = -1;
		   //procura function com async
		   next = code.search(/[\s]*async[\s]*function[\s]*(([a-zA-Z]|\$|_)+([a-zA-Z]|\$|_|[0-9])*)*/);
		   //caso não tenha mais nenhuma finaliza
		   if (next == -1)
			   break;
		   
		   var newFunction = buildAsyncFunctionBody(code, next);
		   var indexes = getNextBraceStartEnd(code, next);
		   
		   code = code.substring(0, next) + newFunction + code.substring(indexes[1] + 1);
		}while(true);
			
	   return code;
	};
    this.translateFunctions = function (code) {
        do {

            var next = -1;
            var reg = new RegExp(/[\s]*function[\s]*(([a-zA-Z]|\$|_)+([a-zA-Z]|\$|_|[0-9])*)*[\s]*\(([^\)]*)\)[\s]*/g);
            var resultArray;
            while ((resultArray = reg.exec(code)) !== null)
            {
				var typeSeparator = getNextValidCharacter(code, reg.lastIndex);
				if(typeSeparator != null && typeSeparator.value == ":"){
					next = resultArray.index;
					break;
				}
				
                var parameters = resultArray[4].split(',');
                if (parameters.length == 1 && trim(parameters[0]) == "")
                    parameters = [];
				
				
                if(parameters.length == 0)
                    continue;
				
                for(var i = 0; i < parameters.length;i++)
                {
                    var paramAndType = parameters[i].split(':');
                    if(paramAndType.length > 1 || trim(parameters[i]).indexOf('...') == 0)
                    {
                        next = reg.index;
                        break;
                    }
                }
            }
            //caso não tenha mais nenhuma finaliza
            if (next == -1)
                break;


            var parmetersIndexes = getNextParenthesesStartEnd(code, next);

            if (parmetersIndexes == null)
				throwLineError(code, next, "Function parameters expected");

            var name = trim(code.substring(next, parmetersIndexes[0])).substring(8);

            var methodBodyIndexes = getNextBraceStartEnd(code, parmetersIndexes[1]);
            if (methodBodyIndexes == null)
				throwLineError(code, next, "Function body expected");

            var parameters = code.substring(parmetersIndexes[0] + 1, parmetersIndexes[1]).replace(')', '').split(',');
            if (parameters.length == 1 && trim(parameters[0]) == "")
                parameters = [];


            var returnType = trim(code.substring(parmetersIndexes[1] + 1, methodBodyIndexes[0]).replace(':', ''));
            if (!returnType || returnType == "")
                returnType = "any";

            var functionEnd = methodBodyIndexes[1] + 1;
            var body = code.substring(methodBodyIndexes[0] + 1, methodBodyIndexes[1]);

            var elementType = {
                name: name,
                isStatic: true,
                modifier: 'public',
                value: {
                    body: body,
                    parameters: parameters,
                    returnType: returnType
                },
				codeIndex: next
            };
            elementType = mergeMethods([elementType], null, code);
            var newCode = code.substring(0, code.indexOf('function', next));
            newCode += "function " + name + "(" + elementType.value.parameters.join(', ');
            newCode += "){\n" + elementType.value.body + "}";
            newCode += code.substring(functionEnd);
            code = newCode;
        } while (true);
        return code;
    }
    this.translate = function (code, options, isLibrary) {
		
        var options = options || defaultOptions();
		isLibrary = isLibrary === true;
        this.options = options;
		code = removeComments(code);
		
		if (options['translateStringTemplates'] !== false)
            code = this.translateStringTemplates(code);
		
        if (options['translateArrowFunctions'] !== false)
            code = this.translateArrowFunctions(code);

		if (options['translateFunctions'] !== false)
            code = this.translateFunctions(code);

        if (options['translateLetAndConst'] !== false)
            code = this.translateLetAndConst(code);
		
        if (options['translateTypedArrays'] !== false)
            code = this.translateTypedArrays(code);
		
        if (options['translateModule'] !== false)
            code = this.translateModule(code);
		
        if (options['translateExports'] !== false)
            code = this.translateExports("module.exports", code, true);
		
        if (options['translateClass'] !== false)
            code = this.translateClass(code);

        if (options['translateImports'] !== false)
            code = this.translateImports(code, isLibrary);
		
		if (options['translateAsyncFunctions'] !== false)
            code = this.translateAsyncFunctions(code);
		
        return code;
    };
    this.translateClass = function (code, start) {
        start = start || 0;
        var script = code.substr(start);
        var classStart = getNextWordStart(script, 0, 'class');
        if (classStart == -1)
            return code;

		var classDecorators = [];
		var decoratorsStart = start + classStart;
		do{
			var lastDecorator = getLastLine(code, decoratorsStart);
			var lastDecoratorValue = trim(lastDecorator.value);
			if(lastDecoratorValue.indexOf("@") == 0){
				classDecorators.push(lastDecoratorValue);
				decoratorsStart = lastDecorator.start;
			}else
				break;
		}while(true);
		
        var classBodyIndexes = getNextBraceStartEnd(script, classStart);
        if (classBodyIndexes == null)
			throwLineError(script, classStart, "Expected { and } in class body");

        var classHeader = script.substring(classStart + 6, classBodyIndexes[0]);

        var headerParts = classHeader.split(/([\s]+extends[\s]+)/);

        var Type = {
            name: trim(headerParts[0]),
            base: headerParts.length > 1 ? trim(headerParts[headerParts.length - 1]) : null,
            methods: [],
            properties: [],
            fields: [],
            subTypes: [],
			codeIndex: classStart
        };

        var classBody = script.substring(classBodyIndexes[0] + 1, classBodyIndexes[1]);
        var nextWord = null;
        var bodyIndex = 0;
		var decorators = null;
        do {
            nextWord = getNextWord(classBody, bodyIndex);

            if (nextWord == null)
                break;
			
            bodyIndex = nextWord.end;
            var typeElement = {
                name: null,
                modifier: null,
                isStatic: false,
                isGet: false,
                isSet: false,
                isMethod: false,
                isSubClass: false,
				isAsync: false,
				isGenerator: false,
                value: null,
				decorators: null,
				className: Type.name,
				codeIndex: bodyIndex + classBodyIndexes[0] + 1
            };

            switch (nextWord.value) {
				case "*":
					typeElement.modifier = "public";
					typeElement.isGenerator = true;
					break;
				case "async":
				    typeElement.modifier = "public";
					typeElement.isAsync = true;
					
					//aceita async como nome de function tambem
					var nextAsyncChar = getNextValidCharacter(classBody, nextWord.end);

					if (nextAsyncChar != null && nextAsyncChar.value == '('){
						typeElement.isAsync = false;
						typeElement.name = nextWord.value;	
					}else
						typeElement.isAsync = true;
                    break;
                case "public":
                    typeElement.modifier = "public";
                    break;
                case "private":
                case "var":
                    typeElement.modifier = "private";
                    break;
                case "static":
                    typeElement.modifier = "public";
                    typeElement.isStatic = true;
                    break;
                case "get":
                    typeElement.modifier = "public";
                    typeElement.isGet = true;
                    break;
                case "set":
                    typeElement.modifier = "public";
                    typeElement.isSet = true;
                    break;
                case "class":
                    typeElement.modifier = "public";
                    typeElement.isSubClass = true;
                    break;
                default:
					if(nextWord.value.indexOf("@") == 0){
						var line = getActualLine(classBody, bodyIndex);
						decorators = decorators || [];
						decorators.push(trim(line.value));
						bodyIndex = line.end;
						continue;
					}
                    typeElement.modifier = "public";
                    typeElement.name = nextWord.value;
                    break;
            }
			typeElement.decorators = decorators;
			decorators = null;

            if (typeElement.name == null) {
				
                nextWord = getNextWord(classBody, bodyIndex);
				
                if (nextWord == null)
                    throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
                bodyIndex = nextWord.end;
                switch (nextWord.value) {
                    case "static":
                        if (typeElement.isStatic)
							throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
                        typeElement.isStatic = true;
                        break;
                    case "get":
                        typeElement.isGet = true;
                        break;
                    case "set":
                        typeElement.isSet = true;
                        break;
                    case "class":
                        typeElement.isSubClass = true;
                        break;
					case "*":
						if (typeElement.isGenerator)
								throwLineError(script, typeElement.codeIndex, "Syntax error", Type);
						typeElement.isGenerator = true;
						break;
					case "async":
						if (typeElement.isAsync)
                            throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
                        
						//aceita async como nome de function tambem
						var nextAsyncChar = getNextValidCharacter(classBody, nextWord.end);

						if (nextAsyncChar != null && nextAsyncChar.value == '('){
							typeElement.isAsync = false;
							typeElement.name = nextWord.value;	
						}else
							typeElement.isAsync = true;
						
						
                        break;
                    default:
                        typeElement.name = nextWord.value;
                }
				
				
				if (typeElement.name == null) {
					nextWord = getNextWord(classBody, bodyIndex);
					if (nextWord == null)
						throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
					bodyIndex = nextWord.end;
					switch (nextWord.value) {
						case "static":
							if (typeElement.isStatic)
								throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
							typeElement.isStatic = true;
							break;
						case "get":
							if (typeElement.isGet)
								throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
							typeElement.isGet = true;
							break;
						case "set":
							if (typeElement.isSet)
								throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
							typeElement.isSet = true;
							break;
						case "class":
							if (typeElement.isSubClass)
								throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
							typeElement.isSubClass = true;
							break;
						case "*":
							if (typeElement.isGenerator)
								throwLineError(script, typeElement.codeIndex, "Syntax error", Type);
							typeElement.isGenerator = true;
							break;
						case "async":
							if (typeElement.isAsync)
								throwLineError(script, typeElement.codeIndex, "Syntax error", Type);
							var nextAsyncChar = getNextValidCharacter(classBody, nextWord.end);

							if (nextAsyncChar != null && nextAsyncChar.value == '('){
								typeElement.isAsync = false;
								typeElement.name = nextWord.value;	
							}else
								typeElement.isAsync = true;
							break;
						default:
							typeElement.name = nextWord.value;
							break;
					}
				}
				
                if (typeElement.name == null) {
                    nextWord = getNextWord(classBody, bodyIndex);
                    if (nextWord == null)
                        throwLineError(script, bodyIndex, "Syntax error", Type);
                    bodyIndex = nextWord.end;
                    if (trim(nextWord.value) == "get" || trim(nextWord.value) == "set") {
                        typeElement.isGet = trim(nextWord.value) == "get";
                        typeElement.isSet = !typeElement.isGet;
                        nextWord = getNextWord(classBody, bodyIndex);
                        if (nextWord == null)
                            throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
                        bodyIndex = nextWord.end;
                    } else if (trim(nextWord.value) == "class") {
                        typeElement.isSubClass = true;
                        nextWord = getNextWord(classBody, bodyIndex);
                        if (nextWord == null)
                            throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
                        bodyIndex = nextWord.end;
                    }
                    typeElement.name = nextWord.value;
                }
            }


			if(typeElement.name.indexOf("*") > -1){
				  if(typeElement.isGenerator)
					throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
				  else{
					  typeElement.name = typeElement.name.replace('*', '');
					  typeElement.isGenerator = true;
					  if(typeElement.name.indexOf("*") > -1){
						 throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", Type);
					  }
				  }
			}
            if (typeElement.isSubClass) {

                if (typeElement.isStatic)
                    throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Syntax error", typeElement);
                var subClassBodyIndexes = getNextBraceStartEnd(classBody, bodyIndex);
                if (subClassBodyIndexes == null)
					throwLineError(script, bodyIndex + classBodyIndexes[0] + 1, "Expected { and } in subclass body", typeElement);

                var subClassScript = classBody.substring(bodyIndex, subClassBodyIndexes[1] + 1);
                typeElement.value = "class " + typeElement.name + " " + subClassScript;
                typeElement.value = this.translateClass(typeElement.value);
                Type.subTypes.push(typeElement);
                bodyIndex = subClassBodyIndexes[1] + 1;
                continue;
            }
            var endCharacter = getNextValidCharacter(classBody, bodyIndex);

            if ((typeElement.isGet || typeElement.isSet) && (endCharacter.value != '('))
                throwLineError(script,  bodyIndex + classBodyIndexes[0] + 1, "Expected (", typeElement);
				
            if (endCharacter.value == ":") {
                var position = getNextEqualsPosition(classBody, endCharacter.index);
                bodyIndex = position.index;
                typeElement.name += classBody.substring(endCharacter.index, position.index);
                endCharacter = position;
            }

            //propriedade sem valor
            if (endCharacter.value == ";") {
                bodyIndex++
                typeElement.value = "undefined";
                Type.fields.push(typeElement);
                continue;
            } else if (endCharacter.value == "(") {
                if (typeElement.isGet || typeElement.isSet)
                    Type.properties.push(typeElement);
                else
                    Type.methods.push(typeElement);

                typeElement.isMethod = true;
                var parmetersIndexes = getNextParenthesesStartEnd(classBody, endCharacter.index);
                if (parmetersIndexes == null)
					throwLineError(script,  bodyIndex + classBodyIndexes[0] + 1, "Function parameters expected", typeElement);

                var parameters = classBody.substring(parmetersIndexes[0] + 1, parmetersIndexes[1]).replace(')', '').split(',');
                if (parameters.length == 1 && trim(parameters[0]) == "")
                    parameters = [];

                var methodBodyIndexes = getNextBraceStartEnd(classBody, endCharacter.index + 1);
                if (methodBodyIndexes == null)
					throwLineError(script,  bodyIndex + classBodyIndexes[0] + 1, "Expected { and } in function body", typeElement);
				
                var returnType = trim(classBody.substring(parmetersIndexes[1] + 1, methodBodyIndexes[0]).replace(':', ''));

                if (returnType && returnType != "") {
                    if (trim(typeElement.name) == "constructor") {
						throwLineError(script,  bodyIndex + classBodyIndexes[0] + 1, "Type annotation cannot appear on a constructor declaration", typeElement);
                    }
                } else
                    returnType = "any";

                typeElement.value = {
                    body: classBody.substring(methodBodyIndexes[0] + 1, methodBodyIndexes[1]),
                    parameters: parameters,
                    returnType: returnType
                };

                typeElement.value.body = this.translateClass(typeElement.value.body);
                bodyIndex = methodBodyIndexes[1] + 1;
                continue;
            } else if (endCharacter.value == "=") {
                Type.fields.push(typeElement);

                var valueInfo = getRemainingLine(classBody, endCharacter.index + 1);
                if (valueInfo == null)
						throwLineError(script, endCharacter.index, "Syntax error", typeElement);
                typeElement.value = valueInfo.value;
                bodyIndex = valueInfo.end + 2;
                continue;
            } else {
				throwLineError(script, bodyIndex + 1, "Syntax error", typeElement);
            }
        } while (true);
		Type.decorators = classDecorators;

        var typeCode = compileType(script, Type);

        script = code.substring(start, decoratorsStart) + typeCode + script.substring(classBodyIndexes[1] + 1);

        return this.translateClass(script);
    }

    this.boostrap =  function (options) {
        var scripts = document.querySelectorAll("script[type='javascript/class']");

        for (var i = 0; i < scripts.length; i++) {
            var context = (typeof global != "undefined") ? global : window;
            var source = scripts[i].attributes.src;
            if (source) {
                var oReq = new XMLHttpRequest();
                oReq.onload = function () {
                    run.call(context, this.responseText, options);
                };
                oReq.open("get", source.value, scripts[i].attributes.async ? true : false);
                oReq.send();
            }
            var code = scripts[i].innerHTML;
            if (code) {
                run.call(context, code, options);
            }
            if (scripts[i].parentElement)
                scripts[i].parentElement.removeChild(scripts[i]);
        }
    };
};
JSComet = new JSComet();
var require = (typeof require == "undefined") ? function require(source, translateCodeAfterImport) { return JSComet.require(source, translateCodeAfterImport) } : require;
var module = (typeof module == "undefined") ? { exports: {} } : module;
var z____memoryImport = z____memoryImport || {};
module.exports["default"] = JSComet;
if(typeof global != "undefined")
	global.JSComet = JSComet;
else if(typeof window != "undefined")
	window.JSComet = JSComet;