import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';
import { Items } from '../items-model';
import { SharedValueService } from '../../services/shared-value.service';

@Component({
  selector: 'app-items-detail',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './items-detail.component.html',
  styleUrl: './items-detail.component.scss',
})
export class ItemsDetailComponent implements OnInit {
  item: Items = { id: 0, name: '', price: 0, description: '', image_url: '', category_id: 0, stock: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private itemsService: ItemsService,
    private sharedValueService: SharedValueService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.itemsService.requestGetItemsList(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.items == null) {
            this.router.navigate(['/items-list']);
          } else {
            this.item = {
              ...(res.items as Items),
              stock: res.items.quantity
            };
          }
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  edit() {
    this.router.navigate(['/items-editor', this.item.id]);
  }

  convertCategoryName(id: number): string {
    return this.categoriesService.convertCategoryName(id);
  }

  getImageUrl() : string{
    return this.sharedValueService.getImageUrl() + this.item.image_url;
  }

  returnPage(){
    this.router.navigate(['/items-list']);
  }
}
