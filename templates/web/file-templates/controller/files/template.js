import { Controller } from 'jscomet.core';

class {ClassName} extends Controller{
	
	constructor(){
		super();
		this.title = "{ClassName}";
	}
	
	public index(){
		return this.view();
	}
}
export default {ClassName};
