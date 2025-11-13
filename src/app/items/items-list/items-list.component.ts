import { Component, OnInit } from '@angular/core';
import { Items } from '../items-model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';
import { ItemsService } from '../../services/items.service';
import { CurrencyPipe } from '@angular/common';
import { Categories } from '../../categories/categories-model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-items-list',
  imports: [ReactiveFormsModule, RouterLink, PagerComponent, CurrencyPipe],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent implements OnInit {
  viewItems: Items[] = [];
  searchText: FormControl = new FormControl('');
  categoriesDropDown: FormControl = new FormControl('ALL');
  pageIndex: number = 0;
  pageSize: number = 10;

  private items: Items[] = [];

  constructor(
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.itemsService.requestGetItemsList().subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res.items);
          // quantityプロパティをstockに変換して格納する
          this.items = this.viewItems = (res.items as any[]).map(i => ({
            ...i,
            stock: i.quantity,
          }));

          console.log(this.items);
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });

    this.categoriesService.updateCategories();

    this.categoriesDropDown.valueChanges.subscribe({
      next: (categoryName: string) => {
        this.searchItems();
      },

      error: () => {},
    });
  }

  searchItems() {
    const category_id = this.categoriesService.getCategories().find((_) => _.name == this.categoriesDropDown.value)?.id;

    this.viewItems = this.items.filter((_) => {
      if (category_id != null && category_id != _.category_id) return false;

      // 空白の場合はすべて取得
      if (this.searchText.value == null || this.searchText.value == '') return true;

      // nameがthis.searchText.valueを含んでいる場合のみ取得する
      return _.name.includes(this.searchText.value);
    });
  }

  createItems() {
    this.router.navigate(['./items-creator']);
  }

  getCategories(): Categories[] {
    return this.categoriesService.getCategories();
  }

  convertCategoryName(id: number): string {
    return this.categoriesService.convertCategoryName(id);
  }
}
