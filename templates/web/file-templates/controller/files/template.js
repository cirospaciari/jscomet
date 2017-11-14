import { Controller } from 'jscomet.core';

class {ClassName} extends Controller{
	
	constructor(){
		super();
		this.title = "{ClassName}";
	}
	
	index(){
		return this.view();
	}
}
export default {ClassName};
