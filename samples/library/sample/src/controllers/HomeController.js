import { Controller } from 'jscomet.core';
import {HttpBinService, User} from './libs/sample.DAL';
import { memoryCache } from 'jscomet.decorators';

class HomeController extends Controller{

	constructor(){
		super();
		this.title = "Home";
	}

	async index(){
		var model = {};

		var service = new HttpBinService();
		var user = new User("ciro", "spaciari");

		model.getResponse = await service.sampleGet("test");
		model.getResponseNamedParameters = await service.sampleGetNamedParameters(user);
		model.postResponse = await service.samplePost(user);
		
		return this.view(model);
	}
}
export default HomeController;
