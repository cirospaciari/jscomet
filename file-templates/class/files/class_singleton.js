class {ClassName} {

	private static Instance : {ClassName} = null;
	
	constructor(){
		if({ClassName}.Instance != null){
			throw '{ClassName}#constuctor - cannot construct singleton';
		}
	}
	
	static get instance() {
		if(!{ClassName}.Instance)
			{ClassName}.Instance = new {ClassName}();
		
        return {ClassName}.Instance;
    }
}

export default {ClassName};