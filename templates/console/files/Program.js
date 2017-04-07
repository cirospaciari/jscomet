class Program{
	
	public static async main(args){
		
		console.log("Type something!");
		
		var line = await console.read();
		
		console.log("you entered: [" + line.trim() + "]");
	}
}

export default Program;