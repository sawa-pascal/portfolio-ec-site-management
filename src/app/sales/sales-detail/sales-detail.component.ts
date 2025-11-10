import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { PagerComponent } from '../../pager/pager.component';
import { SharedValueService } from '../../services/shared-value.service';
import { CurrencyPipe } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-sales-detail',
  imports: [ReactiveFormsModule, PagerComponent, CurrencyPipe],
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.scss',
})
export class SalesDetailComponent implements OnInit {
  id: number = 0;
  total: number = 0;
  totalWithTax: number = 0;

  viewSaleItems: any = [];
  searchText: FormControl = new FormControl('');
  searchMailText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private saleItems: any = [];

  constructor(
    private salesService: SalesService,
    private route: ActivatedRoute,
    private sharedValueService: SharedValueService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.salesService.requestGetSaleItems(this.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.saleItems = this.viewSaleItems = res.sale_items;
          console.log(this.saleItems);

          const tax = 0.1;
          this.total = res.sale_items.reduce(
            (acc: number, cur: any) => acc + cur.price * cur.quantity,
            0
          );
          this.totalWithTax = this.total * (1.0 + tax);
        } else {
          console.log('res.message');
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  searchSaleItems() {
    // this.viewSaleItems = this.saleItems.filter(() => {
    //   if (!this.searchText.value) return true;
    //   let userName = this.usersService.getUsers().find((_) => _.id == sale.user_id)?.name;
    //   if (!userName) return true;
    //   const name_query = String(this.searchText.value).toLowerCase();
    //   return userName.toLowerCase().includes(name_query);
    // });
  }

  getImageUrl(imageUrl: string): string {
    return this.sharedValueService.getImageUrl() + imageUrl;
  }

  convertUserName(id: number): string {
    return this.usersService.convertUserName(id);
  }
}
