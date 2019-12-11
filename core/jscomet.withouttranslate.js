
var JSComet = function () {
    
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
            if (extension != "js" && extension != "json")
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
        if (extension != "js" && extension != "json") {
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
                                self.z____importCache[source] = JSON.parse(this.responseText);
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
 
