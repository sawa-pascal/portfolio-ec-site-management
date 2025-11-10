import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';
import { Sales } from '../sales-model';
import { SalesService } from '../../services/sales.service';
import { UsersService } from '../../services/users.service';
import { Users } from '../../users/users-model';

@Component({
  selector: 'app-sales-list',
  imports: [ReactiveFormsModule, RouterLink, PagerComponent],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
})
export class SalesListComponent implements OnInit {
  viewSales: Sales[] = [];
  searchText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private sales: Sales[] = [];

  constructor(private salesService: SalesService, private usersService: UsersService) {}

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

    this.usersService.updateUsers();
  }

  searchSales() {
    this.viewSales = this.sales.filter((sale) => {
      if (!this.searchText.value) return true;

      let userName = this.usersService.getUsers().find((_) => _.id == sale.user_id)?.name;
      if (!userName) return true;

      const name_query = String(this.searchText.value).toLowerCase();
      return userName.toLowerCase().includes(name_query);
    });
  }

  getUsers(): Users[] {
    return this.usersService.getUsers();
  }

  convertUserName(id: number): string {
    return this.usersService.convertUserName(id);
  }
}
