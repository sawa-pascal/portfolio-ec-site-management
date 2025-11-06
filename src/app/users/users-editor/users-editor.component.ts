import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Users } from '../users-model';
import { PrefecturesService } from '../../services/prefectures.service';
import { Prefecture } from '../prefectures_model';

@Component({
  selector: 'app-users-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './users-editor.component.html',
  styleUrl: './users-editor.component.scss',
})
export class UsersEditorComponent implements OnInit {
  id: number = 0;

  name: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  tel: FormControl = new FormControl('', Validators.required);
  prefecturesDropDown: FormControl = new FormControl('北海道'); // 別の方法で初期化を考えたほうが良いngInitでは無理だった
  address: FormControl = new FormControl('');

  myForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    tel: this.tel,
    prefecturesDropDown: this.prefecturesDropDown,
    address: this.address,
  });

  private password: string = '1234';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private prefecturesService: PrefecturesService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.usersService.requestGetUsersList(this.id).subscribe({
      next: (res: any) => {
        if (res.success && res.users) {
          const u = res.users as Users;
          this.name.setValue(u.name);
          this.email.setValue(u.email);
          this.tel.setValue(u.tel);
          this.password = u.hashed_password;
          this.prefecturesDropDown.setValue(
            this.prefecturesService.convertPrefectureName(Number(u.prefecture_id))
          );
          this.address.setValue(u.address);
        } else {
          this.router.navigate(['/users-list']);
        }
      },
      error: () => console.log('requestGet失敗'),
    });
  }

  update() {
    const prefecture_id = this.prefecturesService
      .getPrefectures()
      .find((_) => _.name == this.prefecturesDropDown.value)?.id;

    let user: Users = {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      hashed_password: this.password,
      tel: this.tel.value,
      prefecture_id: Number(prefecture_id),
      address: this.address.value,
      created_at: new Date(),
    };

    this.usersService.requestUpdateUsers(user).subscribe({
      next: (res: any) => {
        if (res.success) this.router.navigate(['./users-list']);
      },
      error: () => console.log('requestUpdate失敗'),
    });
  }

  destroy() {
    this.usersService.requestDeleteUsers(this.id).subscribe({
      next: (res: any) => {
        if (res.success) this.router.navigate(['./users-list']);
      },
      error: () => console.log('requestDelete失敗'),
    });
  }

  getPrefectures(): Prefecture[] {
    return this.prefecturesService.getPrefectures();
  }
}
