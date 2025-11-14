import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';
import { Sales } from '../sales-model';
import { SalesService } from '../../services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Injectable()
export class CustomDatepickerIntl extends MatDatepickerIntl {
  override calendarLabel = 'カレンダー';
  override openCalendarLabel = 'カレンダーを開く';

  override prevMonthLabel = '前の月';
  override nextMonthLabel = '次の月';

  override prevYearLabel = '前年';
  override nextYearLabel = '翌年';

  override prevMultiYearLabel = '24年前';
  override nextMultiYearLabel = '24年後';
}

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
  override getDateNames(): string[] {
    return [...Array(31).keys()].map((i) => String(i + 1));
  }
}

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
    DatePipe,
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MatDatepickerIntl, useClass: CustomDatepickerIntl },
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
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

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.salesService.requestGetSalesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.sales = this.viewSales = res.sales as Sales[];

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


  onStartTimeChange(event: any) {
    const timeValue = event.target.value;
    if (!timeValue) return;

    // "HH:mm" 形式
    const [hours, minutes] = timeValue.split(':').map(Number);

    if (!this.selectedStartDate) {
      // デフォルト値: 今日にする
      const today = new Date();
      this.selectedStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
    } else {
      // 既存の日付に時間をセット
      this.selectedStartDate.setHours(hours);
      this.selectedStartDate.setMinutes(minutes);
      this.selectedStartDate.setSeconds(0);
      this.selectedStartDate.setMilliseconds(0);
    }

    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  onEndTimeChange(event: any) {
    const timeValue = event.target.value;
    if (!timeValue) return;

    const [hours, minutes] = timeValue.split(':').map(Number);

    if (!this.selectedEndDate) {
      // デフォルト値: 今日にする
      const today = new Date();
      this.selectedEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 59, 999);
    } else {
      // 既存の日付に時間をセット
      this.selectedEndDate.setHours(hours);
      this.selectedEndDate.setMinutes(minutes);
      // 終了時間なので秒・ミリ秒は最大値にする
      this.selectedEndDate.setSeconds(59);
      this.selectedEndDate.setMilliseconds(999);
    }

    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  onStartDateChange(event: any) {
    // event.value は Date オブジェクト
    const prev = this.selectedStartDate;
    this.selectedStartDate = event.value;

    // すでに時間指定があればそれを使う、なければデフォルト(00:00:00.000)にする
    if (prev instanceof Date && this.selectedStartDate instanceof Date) {
      this.selectedStartDate.setHours(prev.getHours());
      this.selectedStartDate.setMinutes(prev.getMinutes());
      this.selectedStartDate.setSeconds(prev.getSeconds());
      this.selectedStartDate.setMilliseconds(prev.getMilliseconds());
    }

    this.filterSalesByPeriod(this.selectedStartDate, this.selectedEndDate);
    this.filterSalesByName();
  }

  onEndDateChange(event: any) {
    // event.value は Date オブジェクト
    const prev = this.selectedEndDate;
    this.selectedEndDate = event.value;

    // すでに時間指定があればそれを使う、なければその日の終わりにする
    if (prev instanceof Date && this.selectedEndDate instanceof Date) {
      this.selectedEndDate.setHours(prev.getHours());
      this.selectedEndDate.setMinutes(prev.getMinutes());
      this.selectedEndDate.setSeconds(prev.getSeconds());
      this.selectedEndDate.setMilliseconds(prev.getMilliseconds());
    } else if (this.selectedEndDate instanceof Date) {
      // 日付選択のみの場合は23:59:59.999にする
      this.selectedEndDate.setHours(23, 59, 59, 999);
    }

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
