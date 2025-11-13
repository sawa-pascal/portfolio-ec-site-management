import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PrefecturesService } from '../../services/prefectures.service';
import { Prefecture } from '../prefectures_model';

@Component({
  selector: 'app-users-creator',
  imports: [ReactiveFormsModule],
  templateUrl: './users-creator.component.html',
  styleUrl: './users-creator.component.scss',
})
export class UsersCreatorComponent {
  name: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  tel: FormControl = new FormControl('', Validators.required);
  prefecturesDropDown: FormControl = new FormControl('', Validators.required);
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
    private usersService: UsersService,
    private router: Router,
    private prefecturesService: PrefecturesService
  ) {}

  store() {
    if (this.myForm.invalid) return;

    const prefecture_id = this.prefecturesService
      .getPrefectures()
      .find((_) => _.name == this.prefecturesDropDown.value)?.id;

    this.usersService
      .requestCreateUsers(
        this.name.value,
        this.email.value,
        this.password,
        this.tel.value,
        Number(prefecture_id),
        this.address.value
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) this.router.navigate(['/users-list']);
        },
        error: () => console.log('requestCreateUsers失敗'),
      });
  }

  getPrefectures(): Prefecture[] {
    return this.prefecturesService.getPrefectures();
  }

  returnPage() {
    this.router.navigate(['./users-list']);
  }
}
