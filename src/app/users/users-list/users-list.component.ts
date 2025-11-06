import { Component, OnInit } from '@angular/core';
import { Users } from '../users-model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PagerComponent } from '../../pager/pager.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  imports: [ReactiveFormsModule, RouterLink, PagerComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  viewUsers: Users[] = [];
  searchText: FormControl = new FormControl('');
  searchMailText: FormControl = new FormControl('');
  pageIndex: number = 0;
  pageSize: number = 10;

  private users: Users[] = [];

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.usersService.requestGetUsersList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.users = this.viewUsers = res.users as Users[];
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  searchUsers() {
    this.viewUsers = this.users.filter((user) => {
      if (!this.searchText.value && !this.searchMailText.value) return true;

      const name_query = String(this.searchText.value).toLowerCase();
      const email_query = String(this.searchMailText.value).toLowerCase();

      return (
        user.name.toLowerCase().includes(name_query) &&
        user.email.toLowerCase().includes(email_query)
      );
    });
  }

  createUsers() {
    this.router.navigate(['./users-creator']);
  }
}
