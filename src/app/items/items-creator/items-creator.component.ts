import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Categories } from '../../categories/categories-model';
import { SharedValueService } from '../../services/shared-value.service';

@Component({
  selector: 'app-items-creator',
  imports: [ReactiveFormsModule],
  templateUrl: './items-creator.component.html',
  styleUrl: './items-creator.component.scss',
})
export class ItemsCreatorComponent implements OnInit {
  name: FormControl = new FormControl('', Validators.required);
  price: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  stock: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  description: FormControl = new FormControl('');
  categoriesDropDown: FormControl = new FormControl('');

  myForm: FormGroup = new FormGroup({
    name: this.name,
    price: this.price,
    stock: this.stock,
    description: this.description,
    categoriesDropDown: this.categoriesDropDown,
  });

  image_url: string = '';

  constructor(
    private categoriesService: CategoriesService,
    private itemsService: ItemsService,
    private router: Router,
    private sharedValueService: SharedValueService
  ) {}

  ngOnInit() {
    this.price.valueChanges.subscribe((value) => {
      if (value < 1) this.price.setValue(1);
    });

    this.stock.valueChanges.subscribe((value) => {
      if (value < 0) this.stock.setValue(0);
    });

    this.categoriesDropDown.setValue(this.categoriesService.getCategories()[0].name);
  }

  store() {
    const category_id = this.categoriesService
      .getCategories()
      .find((_) => _.name == this.categoriesDropDown.value)?.id;

    console.log(category_id);

    this.itemsService
      .requestCreateItems(
        this.name.value,
        this.price.value,
        this.description.value,
        this.image_url,
        Number(category_id),
        this.stock.value
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.router.navigate(['/items-list']);
          }
          else{
            console.log(res.message);
          }
        },
        error: () => {
          console.log('requestCreate失敗');
        },
      });
  }

  getCategories(): Categories[] {
    return this.categoriesService.getCategories();
  }

  getImageUrl(): string {
    const url = this.sharedValueService.getEditImageUrl() + this.image_url;
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

  returnPage(){
    this.router.navigate(['/items-list']);
  }
}
