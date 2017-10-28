import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'table-paging',
  template: `
    <nav class="ng2-smart-pagination-nav" *ngIf="pageData.totalPages!=0">
      <ul class="ng2-smart-pagination pagination">
        <li class="ng2-smart-page-item page-item" [class.disabled]="pageData.currentPage==1">
          <a aria-label="First" class="ng2-smart-page-link page-link" (click)="gotoPage(1,$event)">
            <span aria-hidden="true">«</span>
            <span class="sr-only">First</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item" [class.active]="page.active" *ngFor="let page of pages">
          <a class="ng2-smart-page-link page-link" (click)="gotoPage(page.number,$event)">{{page.number}}</a>
        </li>
        <li class="ng2-smart-page-item page-item" [class.disabled]="pageData.currentPage==pageData.totalPages">
          <a aria-label="Last" class="ng2-smart-page-link page-link" (click)="gotoPage(pageData.totalPages,$event)">
            <span aria-hidden="true">»</span>
            <span class="sr-only">Last</span>
          </a>
        </li>
      </ul>
    </nav>`,
  styles: [
    `
    nav.ng2-smart-pagination-nav {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        margin-top: 1.5rem;
    }
    nav.ng2-smart-pagination-nav .ng2-smart-pagination {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }
    nav.ng2-smart-pagination-nav .ng2-smart-pagination .page-item.disabled .page-link,
    nav.ng2-smart-pagination-nav .ng2-smart-pagination .page-item.disabled .page-link:focus,
    nav.ng2-smart-pagination-nav .ng2-smart-pagination .page-item.disabled .page-link:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: #ffffff;
    }
    nav.ng2-smart-pagination-nav .pagination {
        font-family: Exo;
        font-size: 1rem;
        line-height: 1.25;
        border: #7659ff solid 1px;
        border-radius: 0.375rem;
    }
    nav.ng2-smart-pagination-nav .pagination li:not(:last-child) {
        border-right: 1px solid #342e73;
    }
    nav.ng2-smart-pagination-nav .pagination li a,
    nav.ng2-smart-pagination-nav .pagination li > span {
        background: transparent;
        color: #ffffff;
        padding: 0.75rem 1.25rem;
        border: none;
    }
    nav.ng2-smart-pagination-nav .pagination li a:hover,
    nav.ng2-smart-pagination-nav .pagination li > span:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: #ffffff;
        text-decoration: none;
    }
    nav.ng2-smart-pagination-nav .pagination li:first-child a,
    nav.ng2-smart-pagination-nav .pagination li:first-child > span {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
    }
    nav.ng2-smart-pagination-nav .pagination li:last-child a,
    nav.ng2-smart-pagination-nav .pagination li:last-child > span {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }
    nav.ng2-smart-pagination-nav .pagination li.active a,
    nav.ng2-smart-pagination-nav .pagination li.active a:hover,
    nav.ng2-smart-pagination-nav .pagination li.active a:focus,
    nav.ng2-smart-pagination-nav .pagination li.active > span,
    nav.ng2-smart-pagination-nav .pagination li.active > span:hover,
    nav.ng2-smart-pagination-nav .pagination li.active > span:focus {
        color: #ffffff;
        background-color: #7659ff;
    }
    .ng2-smart-pagination {
        display: inline-block;
        font-size: .875em;
        padding: 0;
    }
    .ng2-smart-pagination .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    .ng2-smart-pagination .ng2-smart-page-item {
        display: inline;
    }
`
  ]
})
export class TablePagingComponent{
  @Input() pageData:any;
  @Output() pageChanged:EventEmitter<number> = new EventEmitter<number>();
  pages:Array<any> = [];

  gotoPage(pageNumber) {
    //if page is not changed then return
    if(pageNumber===this.pageData.currentPage){
      return;
    }
    //set the current page as passed page number
    this.pageData.currentPage = pageNumber;
    this.pageChanged.emit(pageNumber);
  }

  renderPages(){
    let loopThrough = Math.min(4,this.pageData.totalPages),
      startIndex = 1;
    this.pages = [];
    //if page size is more than 4 than set the start index
    if(this.pageData.totalPages>4){
      //if pae is last or second last page then make the start index as pagesize - 3
      if(this.pageData.currentPage==this.pageData.totalPages || this.pageData.currentPage==this.pageData.totalPages-1){
        startIndex = this.pageData.totalPages-3;
      } else if(this.pageData.currentPage>2 && this.pageData.currentPage+2<=this.pageData.totalPages){
        //if pag is not last page then set the index as current page - 1
        startIndex = this.pageData.currentPage - 1 ;
      }
    }

    //add the pages in page array to render
    for(let i=startIndex;i<=(startIndex+loopThrough-1);i++){
      this.pages.push({number:i,active:(i==this.pageData.currentPage)});
    }
  }
}
