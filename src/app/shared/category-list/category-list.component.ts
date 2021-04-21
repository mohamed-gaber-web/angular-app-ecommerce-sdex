import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAllCategory } from '../api/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  @Input() categories;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  sub: Subscription[] = []
  mainCategories;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.getAllCategories();
  }

  public ngDoCheck() {
    if(this.categories && !this.mainCategories) {
      this.mainCategories = this.categories.filter(category => category.productCategoryId == this.categoryParentId); 
    }
  }

  public stopClickPropagate(event: any){
    if(window.innerWidth < 960){
      event.stopPropagation();
      event.preventDefault();
    }    
  }

  public changeCategory(event){
    this.change.emit(event);
  }

  getAllCategories() {
    const params = `?Offset=0&Limit=10`;
    this.sub.push(
      this.http.get(`${getAllCategory}` + params)
      .subscribe(response => {
        console.log(response['result'])
        this.mainCategories = response['result'];
      })
    )
  }


  ngOnDestroy(): void {
    this.sub.forEach(ele => {
      ele.unsubscribe();
    }) 
  }

}