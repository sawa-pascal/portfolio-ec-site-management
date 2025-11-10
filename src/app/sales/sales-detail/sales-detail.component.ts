import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sales } from '../sales-model';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.scss',
})
export class SalesDetailComponent implements OnInit {
  viewSales: Sales[] = [];
  searchText: FormControl = new FormControl('');
  searchMailText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private sales: Sales[] = [];

  constructor(private salesService: SalesService, private router: Router) {}

  ngOnInit() {
    this.salesService.requestGetSalesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.sales = this.viewSales = res.sales as Sales[];
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  searchSales() {
    // this.viewSales = this.sales.filter((sale) => {
    //   if (!this.searchText.value && !this.searchMailText.value) return true;

    //   const name_query = String(this.searchText.value).toLowerCase();
    //   const email_query = String(this.searchMailText.value).toLowerCase();

    //   return (
    //     sale.name.toLowerCase().includes(name_query) &&
    //     sale.email.toLowerCase().includes(email_query)
    //   );
    // });
  }
}
