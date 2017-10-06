/**
 * Created by dinesh on 2/10/17.
 */
import {Injectable} from "@angular/core";
import {DataService} from "../../../@core/data/data.service";

@Injectable()
export class <%=ModuleNameSingular%>Service{
	constructor(private dataService:DataService){

	}

	get<%=ModuleNamePlural%>(){
		return this.dataService.callAPI({url:'/api/<%=moduleNamePlural%>'});
	}

	create<%=ModuleNameSingular%>(body){
		return this.dataService.callAPI({
			url:'/api/<%=moduleNamePlural%>',
			method:'post',
			body:body
		});
	}

	update<%=ModuleNameSingular%>(body){
		return this.dataService.callAPI({
			url:'/api/<%=moduleNamePlural%>/'+body.id,
			method:'put',
			body:body
		});
	}

	delete<%=ModuleNameSingular%>(id){
		return this.dataService.callAPI({
			url:'/api/<%=moduleNamePlural%>/'+id,
			method:'delete'
		});
	}
}
