import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { ItemsService } from '../../services/items.service';
import { Items } from '../items-model';
import { Categories } from '../../categories/categories-model';
import { SharedValueService } from '../../services/shared-value.service';

@Component({
  selector: 'app-items-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './items-editor.component.html',
  styleUrl: './items-editor.component.scss',
})
export class ItemsEditorComponent implements OnInit {
  id: number = 0;
  name: FormControl = new FormControl('', Validators.required);
  price: FormControl = new FormControl(0, Validators.required);
  description: FormControl = new FormControl('');
  categoriesDropDown: FormControl = new FormControl('');

  myForm: FormGroup = new FormGroup({
    name: this.name,
    price: this.price,
    description: this.description,
    categoriesDropDown: this.categoriesDropDown,
  });

  image_url: string = '';

  private first_origin_image_url: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private itemsService: ItemsService,
    private sharedValueService: SharedValueService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);

    this.itemsService.requestGetItemsList(this.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.items == null) {
            this.router.navigate(['/items-list']);
          } else {
            this.name.setValue(res.items['name']);
            this.price.setValue(Number(res.items['price']));
            this.description.setValue(res.items['description']);
            this.first_origin_image_url = this.image_url = res.items['image_url'];
            this.categoriesDropDown.setValue(
              this.categoriesService.convertCategoryName(Number(res.items['category_id']))
            );
          }
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  update() {
    const category_id = this.categoriesService
      .getCategories()
      .find((_) => _.name == this.categoriesDropDown.value)?.id;

    let item: Items = {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      description: this.description.value,
      image_url: this.image_url,
      category_id: Number(category_id),
    };

    console.log(this.first_origin_image_url);
    this.itemsService.requestUpdateItems(item, this.first_origin_image_url).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['./items-list']);
        }else{
          console.log('エラー' + res.message);
        }
      },
      error: () => {
        console.log('requestUpdate失敗');
      },
    });
  }

  destroy() {
    this.itemsService.requestDeleteItems(this.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['./items-list']);
        }
      },
      error: () => {
        console.log('requestDelete失敗');
      },
    });
  }

  getCategories(): Categories[] {
    return this.categoriesService.getCategories();
  }

  convertCategoryName(id: number): string {
    return this.categoriesService.convertCategoryName(id);
  }

  getImageUrl(id: number): string {
    let url = '';
    if (this.first_origin_image_url != this.image_url) {
      url = this.sharedValueService.getEditImageUrl() + this.image_url;
    } else {
      url = this.sharedValueService.getImageUrl() + this.image_url;
    }
    console.log(url);
    return url;
  }

  // ［2］アップロードの実行
  onchange(list: any) {
    // ファイルが指定されていなければ
    if (list.length <= 0) {
      return;
    }

    // ［3］ファイルを取得
    let f = list[0];
    // ［4］ファイルをセット
    let data = new FormData();
    data.append('upfile', f, f.name);
    this.itemsService
      .requestUploadItemImage(this.image_url, this.categoriesDropDown.value, data)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log(res.message);
            this.image_url = res.image_url;
          } else {
            console.log(res.message);
          }
        },
        error: (res: any) => {
          console.log('requestUploadItemImage失敗' + res.message);
        },
      });
  }
}
