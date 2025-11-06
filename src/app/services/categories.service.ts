import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';
import { Categories } from '../categories/categories-model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories: Categories[] = [];

  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {
    this.updateCategories();
  }

  requestGetCategoriesList(id: number = 0): Observable<any> {
    return this.http.get(
      `${this.sharedValueService.getApiUrl()}categories/get_categories_list.php?id=${id}`
    );
  }

  requestCreateCategories(name: string, display_order: number) {
    return this.http.post(
      `${this.sharedValueService.getApiUrl()}categories/create_categories.php`,
      {
        name: name,
        display_order: display_order,
      }
    );
  }

  requestUpdateCategories(category: Categories) {
    return this.http.post(
      `${this.sharedValueService.getApiUrl()}categories/update_categories.php`,
      {
        id: category.id,
        name: category.name,
        display_order: category.display_order,
      }
    );
  }

  requestDeleteCategories(id: number) {
    return this.http.post(
      `${this.sharedValueService.getApiUrl()}categories/delete_categories.php`,
      {
        id: id,
      }
    );
  }

  updateCategories() {
    this.requestGetCategoriesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.categories = res.items as Categories[];
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  getCategories(): Categories[] {
    return this.categories;
  }

  convertCategoryName(id: number): string {
    const category = this.categories.find((_) => _.id == id);
    return category == null ? '' : category.name;
  }
}
