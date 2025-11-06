import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-creator',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-creator.component.html',
  styleUrl: './categories-creator.component.scss',
})
export class CategoriesCreatorComponent implements OnInit {
  name: FormControl = new FormControl('', Validators.required);
  display_order: FormControl = new FormControl(0, [Validators.required]);

  myForm: FormGroup = new FormGroup({
    name: this.name,
    display_order: this.display_order,
  });

  constructor(private categoriesService: CategoriesService, private router: Router) {}

  ngOnInit() {}

  store() {
    this.categoriesService
      .requestCreateCategories(this.name.value, this.display_order.value)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.router.navigate(['/categories-list']);
          }
        },
        error: () => {
          console.log('requestCreate失敗');
        },
      });
  }
}
