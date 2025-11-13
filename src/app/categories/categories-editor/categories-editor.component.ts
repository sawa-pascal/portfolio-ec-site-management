import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Categories } from '../categories-model';

@Component({
  selector: 'app-categories-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-editor.component.html',
  styleUrl: './categories-editor.component.scss',
})
export class CategoriesEditorComponent implements OnInit {
  id: number = 0;
  name: FormControl = new FormControl('', Validators.required);
  display_order: FormControl = new FormControl(0, Validators.required);

  myForm: FormGroup = new FormGroup({
    name: this.name,
    display_order: this.display_order,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);

    this.categoriesService.requestGetCategoriesList(this.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.items == null) {
            this.router.navigate(['/categories-list']);
          } else {
            this.name.setValue(res.items['name']);
            this.display_order.setValue(Number(res.items['display_order']));
          }
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  update() {
    let category: Categories = {
      id: this.id,
      name: this.name.value,
      display_order: this.display_order.value,
    };

    this.categoriesService.requestUpdateCategories(category).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['./categories-list']);
        }
      },
      error: () => {
        console.log('requestUpdate失敗');
      },
    });
  }

  destroy() {
    this.categoriesService.requestDeleteCategories(this.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['./categories-list']);
        }
      },
      error: () => {
        console.log('requestDelete失敗');
      },
    });
  }

  returnPage() {
    this.router.navigate(['/categories-detail', this.id]);
  }
}
