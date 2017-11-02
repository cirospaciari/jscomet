import BaseController from './controllers/BaseController';

//BaseController implements onActionExecuting and load menu and footer information
class HomeController extends BaseController{
	
	constructor(){
		super();
		this.title = "Home";
	}
	
	public index(){
		return this.view();
	}

	
}
export default HomeController;