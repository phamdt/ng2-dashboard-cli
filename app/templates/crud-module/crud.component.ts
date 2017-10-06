import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import {<%=ModuleNameSingular%>Service} from "./<%=moduleNameSingular%>.service";

@Component({
	selector: 'ngx-smart-table',
	templateUrl: './<%=moduleNameSingular%>.component.html',
	styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class <%=ModuleNameSingular%>Component {

	settings = {
		add: {
			addButtonContent: '<i class="nb-plus"></i>',
			createButtonContent: '<i class="nb-checkmark"></i>',
			cancelButtonContent: '<i class="nb-close"></i>',
			confirmCreate:true
		},
		edit: {
			editButtonContent: '<i class="nb-edit"></i>',
			saveButtonContent: '<i class="nb-checkmark"></i>',
			cancelButtonContent: '<i class="nb-close"></i>',
			confirmSave:true
		},
		delete: {
			deleteButtonContent: '<i class="nb-trash"></i>',
			confirmDelete: true,
		},
		columns: <%-fields%>,
	};

	source: LocalDataSource = new LocalDataSource();

	constructor(private service: SmartTableService,private <%=moduleNameSingular%>Service:<%=ModuleNameSingular%>Service) {
		this.getData();
	}

	getData(){
		this.<%=moduleNameSingular%>Service.get<%=ModuleNamePlural%>()
			.subscribe((<%=moduleNamePlural%>)=>this.source.load(<%=moduleNamePlural%>.rows))
	}

	delete<%=ModuleNameSingular%>(event){
		if (window.confirm('Are you sure you want to delete?')) {
			this.<%=moduleNameSingular%>Service.delete<%=ModuleNameSingular%>(event.data.id)
				.subscribe(()=>{
					event.confirm.resolve();
					this.getData();
				},()=>{
					alert('Error in deleting the <%=moduleNamePlural%>.');
					event.confirm.reject()
				})
		} else {
			event.confirm.reject();
		}
	}

	create<%=ModuleNameSingular%>(event){
		this.<%=moduleNameSingular%>Service.create<%=ModuleNameSingular%>(event.newData)
			.subscribe(()=>{
				event.confirm.resolve();
				this.getData();
			},()=>{
				alert('Error in creating the <%=moduleNamePlural%>.');
				event.confirm.reject();
			})
	}

	update<%=ModuleNameSingular%>(event){
		this.<%=moduleNameSingular%>Service.update<%=ModuleNameSingular%>(event.newData)
			.subscribe(()=>{
				event.confirm.resolve();
				this.getData();
			},()=>{
				alert('Error in updating the <%=moduleNamePlural%>.');
				event.confirm.reject();
			})
	}
}
