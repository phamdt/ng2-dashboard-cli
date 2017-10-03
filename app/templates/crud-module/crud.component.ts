import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';
import {<%=CrudModuleName%>Service} from "./<%=crudsModuleName%>.service";

@Component({
	selector: 'ngx-smart-table',
	templateUrl: './<%=crudsModuleName%>.component.html',
	styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class <%=CrudsModuleName%>Component {

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
		columns: {
			firstName: {
				title: 'First Name',
				type: 'string',
			},
			lastName: {
				title: 'Last Name',
				type: 'string',
			},
			<%=crudModuleName%>Name: {
				title: '<%=CrudModuleName%> Name',
				type: 'string',
			},
			email: {
				title: 'E-mail',
				type: 'string',
			},
			age: {
				title: 'Age',
				type: 'number',
			},
		},
	};

	source: LocalDataSource = new LocalDataSource();

	constructor(private service: SmartTableService,private <%=crudModuleName%>Service:<%=CrudModuleName%>Service) {
		this.getData();
	}

	getData(){
		this.<%=crudModuleName%>Service.get<%=CrudsModuleName%>()
			.subscribe((<%=crudsModuleName%>)=>this.source.load(<%=crudsModuleName%>.rows))
	}

	delete<%=CrudModuleName%>(event){
		if (window.confirm('Are you sure you want to delete?')) {
			this.<%=crudModuleName%>Service.delete<%=CrudModuleName%>(event.data.id)
				.subscribe(()=>{
					event.confirm.resolve();
					this.getData();
				},()=>{
					alert('Error in deleting the <%=crudModuleName%>.');
					event.confirm.reject()
				})
		} else {
			event.confirm.reject();
		}
	}

	create<%=CrudModuleName%>(event){
		this.<%=crudModuleName%>Service.create<%=CrudModuleName%>(event.newData)
			.subscribe(()=>{
				event.confirm.resolve();
				this.getData();
			},()=>{
				alert('Error in creating the <%=crudModuleName%>.');
				event.confirm.reject();
			})
	}

	update<%=CrudModuleName%>(event){
		this.<%=crudModuleName%>Service.update<%=CrudModuleName%>(event.newData)
			.subscribe(()=>{
				event.confirm.resolve();
				this.getData();
			},()=>{
				alert('Error in updating the <%=crudModuleName%>.');
				event.confirm.reject();
			})
	}
}
