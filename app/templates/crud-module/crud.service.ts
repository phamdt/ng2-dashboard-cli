/**
 * Created by dinesh on 2/10/17.
 */
import {Injectable} from "@angular/core";
import {DataService} from "../../../@core/data/data.service";

@Injectable()
export class <%=CrudModuleName%>Service{
	constructor(private dataService:DataService){

	}

	get<%=CrudsModuleName%>(){
		return this.dataService.callAPI({url:'/api/<%=crudsModuleName%>'});
	}

	create<%=CrudModuleName%>(body){
		return this.dataService.callAPI({
			url:'/api/<%=crudsModuleName%>',
			method:'post',
			body:body
		});
	}

	update<%=CrudModuleName%>(body){
		return this.dataService.callAPI({
			url:'/api/<%=crudsModuleName%>/'+body.id,
			method:'put',
			body:body
		});
	}

	delete<%=CrudModuleName%>(id){
		return this.dataService.callAPI({
			url:'/api/<%=crudsModuleName%>/'+id,
			method:'delete'
		});
	}
}
