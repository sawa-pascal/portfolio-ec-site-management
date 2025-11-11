import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Categories } from '../categories-model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';

@Component({
  selector: 'app-categories-list',
  imports: [ReactiveFormsModule, RouterLink, PagerComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
})
export class CategoriesListComponent implements OnInit {
  viewItems: Categories[] = [];
  searchText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private items: Categories[] = [];

  constructor(private categoriesService: CategoriesService, private router: Router) {}

  ngOnInit() {
    this.categoriesService.requestGetCategoriesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.items = this.viewItems = (res.items as Categories[]).sort((a, b) => a.id - b.id);
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  searchCategories() {
    this.viewItems = this.items.filter((_) => {
      // 空白の場合はすべて取得
      if (this.searchText.value == null || this.searchText.value == '') return true;

      // nameがthis.searchText.valueを含んでいる場合のみ取得する
      return _.name.includes(this.searchText.value);
    });
  }

  createCategories() {
    this.router.navigate(['./categories-creator']);
  }
}
