import {Component, OnInit, ViewChild} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {<%=ModuleNameSingular%>Service} from "./<%=moduleNameSingular%>.service";
import {Observable, Subject} from "rxjs/Rx";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {TablePagingComponent} from "../table-paging.component";


@Component({
	selector: 'ngx-smart-table',
	templateUrl: './<%=moduleNameSingular%>.component.html',
	styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class <%=ModuleNameSingular%>Component implements OnInit{
	private filterTerms = [];
	private rowsPerPage = 10;
	@ViewChild(TablePagingComponent) pagingComponent: TablePagingComponent;
	pageData:any = {
		totalPages:0,
		currentPage:1
	};
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
	searchQuery:any = {};
	source: LocalDataSource = new LocalDataSource();
	pendingRequest:any;

	constructor(private <%=moduleNameSingular%>Service:<%=ModuleNameSingular%>Service) {
		this.getData();
	}

	ngOnInit(){
		//wait to render the filter inputs
		setTimeout(()=>{
			let index = 0;
			for (let key in this.settings.columns){
				let i = index;
				this.filterTerms.push(new Subject<string>());
				Observable.fromEvent(document.getElementsByTagName('input-filter')[index], 'keyup')
					.subscribe((event:any)=>{
						this.filterTerms[i].next(event.target.value);
					});
				this.filterTerms[i]
					.debounceTime(300) //wait for 300 for next call
					.distinctUntilChanged() // do not call if data is unchanged
					.subscribe(term => {
						if(!term){
							delete this.searchQuery[key]; //remove the search from query string
						} else {
							this.searchQuery[key] = term; //add term in search string
						}
						this.getData();
					});
				index++;
			}
		},2000);
	}

	getData(){
		if(this.pendingRequest){
			this.pendingRequest.unsubscribe();
			this.pendingRequest = false;
		}
		this.searchQuery.page = this.pageData.currentPage;
		this.searchQuery.rows = this.rowsPerPage;
		this.pendingRequest = this.<%=moduleNameSingular%>Service.get<%=ModuleNamePlural%>(this.searchQuery)
			.subscribe((<%=moduleNamePlural%>)=>{
				this.source.load(<%=moduleNamePlural%>.rows);
				this.pageData.totalPages = Math.ceil(<%=moduleNamePlural%>.count/this.rowsPerPage);
				this.pendingRequest = false;
				this.pagingComponent.renderPages();
			});
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
