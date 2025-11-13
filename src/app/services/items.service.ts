import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';
import { Items } from '../items/items-model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  requestGetItemsList(id: number = 0): Observable<any> {
    return this.http.get(`${this.sharedValueService.getApiUrl()}items/get_items_list.php?id=${id}`);
  }

  requestCreateItems(
    name: string,
    price: number,
    description: string,
    image_url: string,
    category_id: number,
    stock: number,
  ) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}items/create_items.php`, {
      name: name,
      price: price,
      description: description,
      image_url: image_url,
      category_id: category_id,
      stock: stock,
    });
  }

  requestUpdateItems(items: Items, origin_image_url: string) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}items/update_items.php`, {
      id: items.id,
      name: items.name,
      price: items.price,
      description: items.description,
      origin_image_url: origin_image_url,
      image_url: items.image_url,
      category_id: items.category_id,
      stock: items.stock,
    });
  }

  requestDeleteItems(id: number) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}items/delete_items.php`, {
      id: id,
    });
  }

  requestUploadItemImage(image_url: string, category_name: string, data: FormData) {
    data.append('image_url', image_url);
    data.append('category_name', category_name);
    return this.http.post(
      `${this.sharedValueService.getApiUrl()}items/upload_item_image.php`,
      data
    );
  }
}
