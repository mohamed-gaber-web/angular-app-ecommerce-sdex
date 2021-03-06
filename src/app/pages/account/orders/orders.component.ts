import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  sub: Subscription;
  isLoading: boolean = false;
  orderPerPage: number = 2;
  currentPage = 0;
  totalOrders: number = 0;
  pageOption = [2, 5, 10, 25];
  orders: any;

  // public orders = [
  //   { number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
  //   { number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
  //   { number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
  //   { number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true },
  //   { number: '#1981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
  //   { number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false }
  // ]
  constructor(private ordersService: OrdersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getOrders()
  }

  getOrders() {
   
   this.isLoading = true;  
   this.sub = this.ordersService.getListOfOrders(this.currentPage, this.orderPerPage)
      .subscribe(response => {
        
        this.isLoading = false;
        this.totalOrders = response['length']
        this.orders = response['result'];
      })
  }

  onPageChanged(pageData: PageEvent) {

    this.isLoading = true;
    this.currentPage = pageData.pageIndex;
    this.orderPerPage = pageData.pageSize;

    this.sub = this.ordersService.getListOfOrders(this.currentPage, this.orderPerPage)
    .subscribe(response => {
      this.isLoading = false;
      this.totalOrders = response['length'];
      this.orders = response['result'];
    })
  }

  openDialog(id: number) {
    let dialogRef = this.dialog.open(OrderDetailsComponent, {
      data: {id}
    });

    // dialogRef.afterClosed().subscribe(() => {
    //   this.isLoading = true; 
    //   this.getAddressByUser().subscribe(data => {
    //     this.isLoading = false; 
    //     this.allAddressByUser = data['result'];       
    //    })  
    // });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
