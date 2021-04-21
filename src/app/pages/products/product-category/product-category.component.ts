import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Settings } from 'src/app/app.settings';
import { getAllCategory } from 'src/app/shared/api/api';
import { FilterProductsService } from 'src/app/shared/filter-products.service';
import { ProductDialogComponent } from 'src/app/shared/products-carousel/product-dialog/product-dialog.component';
import { ProductsService } from 'src/app/shared/services/products.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UiService } from 'src/app/shared/services/ui.service';




@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {

  productsOfCategory: any;
  filterForm: FormGroup; 
  isLoading = false;
  isImageLoading: false;
  mainCategories: any;
  sub: Subscription[] = [];
  filterProductsByCategory: [];
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  // private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;
  public brands = [];
  public priceFrom: number = 100;
  public priceTo: number = 2000;
  public page:any;
  public settings: Settings;

  searchItems: any

  // pagination items
  itemsPerPage: number = 10;
  currentPageItem = 0;
  totalOrders: number = 0;
  pageOption = [2, 5, 10, 25];

  constructor(
    private productsService: ProductsService, 
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private filterProducts: FilterProductsService,
    private appService: AppService,
    private uiService: UiService,
    private fb: FormBuilder
    ) {
      console.log(this.searchItems);
      
     }
    
  ngOnInit(): void {

    this.filterForm = this.fb.group({
      'Category': [],
      'Brand': ['']
    })

    this.getAllCategories(); // get all category
    this.getAllBrands(); // get all brands
    this.getAllProductsOfCategory(); // get all products from category

    this.count = this.counts[0];
    this.sort = this.sortings[0];
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };

  }


  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count){
    this.count = count;
    this.getAllProductsOfCategory();
  }

  public changeSorting(sort){
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }

  // public onPageChanged(event){
  //     this.page = event;
  //     this.getAllProductsOfCategory(); 
  //     window.scrollTo(0,0); 
  // }


  // get all products of category
  getAllProductsOfCategory() {
    this.uiService.showLoadingBar();
    this.isLoading = true;
    this.sub.push(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          return this.productsService.getProductByCategory(params.get('catId'), this.currentPageItem, this.itemsPerPage)
        })
      ).subscribe(response => {
        this.uiService.hideLoadingBar();
        this.isLoading = false;
       this.productsOfCategory = response['result'];
       this.filterProductsByCategory = this.productsOfCategory;
       this.totalOrders = response['length'];
      })
    );
  }

  // get all category 
  getAllCategories() {
    this.isLoading = true;
    const params = `?Offset=0&Limit=10`;
    this.sub.push(
      this.http.get(`${getAllCategory}` + params)
      .subscribe(response => {
        this.isLoading = false;
        this.mainCategories = response['result'];
      })
    )
  }

  // get all category 
  getAllBrands() {
    this.isLoading = true;
    this.sub.push(
      this.appService.getBrands()
      .subscribe(response => {
        this.isLoading = false;
        this.brands = response['result'];
      })
    )
  }

  // filter products by category
  onFilterProductCategory(category: any) {
    this.searchItems.push({
      categoryId: category.id
    })
  }

  // filter products by category.
  onChangeBrand(brand: any) {
    this.searchItems.push({
      brandId: brand.brandId
    })
  }

  // paginated products
  onPageChanged(pageData: PageEvent) {

    this.isLoading = true;
    this.currentPageItem = pageData.pageIndex;
    this.itemsPerPage = pageData.pageSize;
    this.getAllProductsOfCategory(); // get all products from category
  }

  onChangePrice(e) {
    console.log(e);
    
    this.uiService.showLoadingBar();
    this.filterProducts.filterProductsByPrice(this.priceFrom, this.priceTo)
    .subscribe(response => {
      this.uiService.hideLoadingBar();
      this.filterProductsByCategory = response['result'];      
    })
  }

  // filter products 
  onFilterProducts() {
    // this.uiService.showLoadingBar();
    // this.filterProducts.filterProductsCategory(category.id, brand.brandId, this.priceFrom, this.priceTo)
    // .subscribe(response => {
    //   this.uiService.hideLoadingBar();
    //   this.filterProductsByCategory = response['result'];
    // })
  }


  ngOnDestroy(): void {
    this.sub.forEach(ele => {
      ele.unsubscribe();
    })
  }



}
