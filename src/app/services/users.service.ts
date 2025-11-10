import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';
import { Users } from '../users/users-model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: Users[] = [];
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {
    this.updateUsers();
  }

  requestGetUsersList(id: number = 0): Observable<any> {
    return this.http.get(`${this.sharedValueService.getApiUrl()}users/get_users_list.php?id=${id}`);
  }

  requestCreateUsers(
    name: string,
    email: string,
    hashed_password: string,
    tel: string,
    prefecture_id: number,
    address: string
  ) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}users/create_users.php`, {
      name: name,
      email: email,
      hashed_password: hashed_password,
      tel: tel,
      prefecture_id: prefecture_id,
      address: address,
    });
  }

  requestUpdateUsers(users: Users) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}users/update_users.php`, {
      id: users.id,
      name: users.name,
      email: users.email,
      hashed_password: users.hashed_password,
      tel: users.tel,
      prefecture_id: users.prefecture_id,
      address: users.address,
    });
  }

  requestDeleteUsers(id: number) {
    return this.http.post(`${this.sharedValueService.getApiUrl()}users/delete_users.php`, {
      id: id,
    });
  }

  updateUsers() {
    this.requestGetUsersList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.users = res.users as Users[];
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  getUsers(): Users[] {
    return this.users;
  }

  convertUserName(id: number): string {
    const user = this.users.find((_) => _.id == id);
    return user == null ? '' : user.name;
  }
}
