import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdministratorService } from '../services/administrator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  name: FormControl = new FormControl('', Validators.required);
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  myForm: FormGroup = new FormGroup({
    name: this.name,
    password: this.password,
  });

  message: string = '';
  constructor(private adminService: AdministratorService, private router: Router) {}

  ngOnInit() {}

  onSignin() {
    this.adminService.signin(this.name.value, this.password.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['./categories-list']);
        } else {
          console.log(res);
          this.message = res.message;
        }
      },
      error: () => {
        this.message = '通信エラー';
      },
    });
  }
}
