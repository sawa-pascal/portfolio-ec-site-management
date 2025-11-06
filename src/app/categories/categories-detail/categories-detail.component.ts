import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories } from '../categories-model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories-detail',
  imports: [],
  templateUrl: './categories-detail.component.html',
  styleUrl: './categories-detail.component.scss',
})
export class CategoriesDetailComponent implements OnInit {
  category: Categories = { id: 0, name: '', display_order: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);

    this.categoriesService.requestGetCategoriesList(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.items == null) {
            this.router.navigate(['/categories-list']);
          } else {
            this.category = res.items as Categories;
          }
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  edit() {
    this.router.navigate(['/categories-editor', this.category.id]);
  }
}
