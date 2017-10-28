/**
 * Created by dinesh on 2/10/17.
 */
import {Injectable} from "@angular/core";
import {DataService} from "../data.service";

@Injectable()
export class <%=ModuleNameSingular%>Service{
	constructor(private dataService:DataService){}

	get<%=ModuleNamePlural%>(searchQuery={}){
		return this.dataService.callAPI({url:'/<%=moduleNamePlural%>',search : searchQuery});
	}

	create<%=ModuleNameSingular%>(body){
		return this.dataService.callAPI({
			url:'/<%=moduleNamePlural%>',
			method:'post',
			body:body
		});
	}

	update<%=ModuleNameSingular%>(body){
		return this.dataService.callAPI({
			url:'/<%=moduleNamePlural%>/'+body.id,
			method:'put',
			body:body
		});
	}

	delete<%=ModuleNameSingular%>(id){
		return this.dataService.callAPI({
			url:'/<%=moduleNamePlural%>/'+id,
			method:'delete'
		});
	}
}
