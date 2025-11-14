import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';
import { Sales } from '../sales-model';
import { SalesService } from '../../services/sales.service';
import { CurrencyPipe } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-sales-list',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PagerComponent,
    CurrencyPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
})
export class SalesListComponent implements OnInit {
  viewSales: Sales[] = [];
  viewSalesTotal: number = 0;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  searchText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private sales: Sales[] = [];

  constructor(private salesService: SalesService, dateAdapter: DateAdapter<NativeDateAdapter>) {
    dateAdapter.setLocale('ja-JP');
  }

  ngOnInit() {
    this.salesService.requestGetSalesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res.sales);
          this.sales = this.viewSales = res.sales as Sales[];
          console.log(this.sales);

          this.viewSalesTotal = res.sales_total;
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  searchSales() {
    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  getItemTotalWithTax(total: number): number {
    const taxRate = 0.1;
    return Math.round(total * (1 + taxRate));
  }

  getTotalWithTax() {
    const taxRate = 0.1;
    return Math.round(this.viewSalesTotal * (1 + taxRate));
  }

  onStartDateChange(event: any) {
    this.selectedStartDate = event.value;

    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  onEndDateChange(event: any) {
    // 指定日 00:00:00になっている
    this.selectedEndDate = event.value;

    // その日の最終時間までを含みたいので 1日未満の時間(24h * 60m * 60s * 1000ms - 1ms)を足している
    this.selectedEndDate?.setTime(this.selectedEndDate.getTime() + 24 * 60 * 60 * 1000 - 1);

    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  private filterSalesByPeriod(startDate: Date | null, endDate: Date | null) {
    const filteredResult = this.sales.reduce(
      (acc, sale) => {
        const saleDate = new Date(sale.date);

        let isAfterStart = true;
        let isBeforeEnd = true;

        if (startDate) {
          isAfterStart = saleDate >= startDate;
        }
        if (endDate) {
          isBeforeEnd = saleDate <= endDate;
        }

        if (isAfterStart && isBeforeEnd) {
          acc.viewSales.push(sale);
          acc.viewSalesTotal += sale.total;
        }
        return acc;
      },
      { viewSales: [] as Sales[], viewSalesTotal: 0 }
    );

    this.viewSales = filteredResult.viewSales;
    this.viewSalesTotal = filteredResult.viewSalesTotal;
  }

  private filterSalesByName() {
    const name_query = String(this.searchText.value ?? '').toLowerCase();
    const filteredResult = this.viewSales.reduce(
      (acc, sale) => {
        // ユーザー名でフィルター
        if (!name_query || sale.user_name.toLowerCase().includes(name_query)) {
          acc.viewSales.push(sale);
          acc.viewSalesTotal += sale.total;
        }
        return acc;
      },
      { viewSales: [] as Sales[], viewSalesTotal: 0 }
    );

    this.viewSales = filteredResult.viewSales;
    this.viewSalesTotal = filteredResult.viewSalesTotal;
  }
}
