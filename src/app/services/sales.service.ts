import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  requestGetSalesList(id: number = 0): Observable<any> {
    return this.http.get(`${this.sharedValueService.getApiUrl()}sales/get_sales_list.php?id=${id}`);
  }

  requestGetSaleItems(id: number): Observable<any> {
    return this.http.post(`${this.sharedValueService.getApiUrl()}sales/get_sale_items.php`, {
      sale_id: id,
    });
  }
}