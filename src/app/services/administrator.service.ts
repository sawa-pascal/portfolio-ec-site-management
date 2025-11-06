import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../admin-model';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  // 未ログイン時は userId = 0; として管理。
  private admin: Admin = { id: 0, name: '', hashed_password: '' };

  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  getAdmin(): Admin {
    return this.admin;
  }

  signin(name: string, hashed_password: string): Observable<{ success: boolean; message: string }> {
    return new Observable<{ success: boolean; message: string }>((observer) => {
      this.requestGetAdministrator(name, hashed_password).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.admin = res.user as Admin;
            console.log(this.admin);
            observer.next({ success: true, message: 'サインイン成功' });
          } else {
            observer.next({ success: false, message: res.message || 'サインイン認証失敗' });
          }
          observer.complete();
        },
        error: () => {
          observer.next({ success: false, message: '通信エラー' });
          observer.complete();
        },
      });
    });
  }

  private requestGetAdministrator(name: string, hashed_password: string): Observable<any> {
    return this.http.get(
      `${this.sharedValueService.getApiUrl()}management_signin.php?name=${name}&hashed_password=${hashed_password}`
    );
  }
}
