import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Users } from '../users-model';
import { PrefecturesService } from '../../services/prefectures.service';

@Component({
  selector: 'app-users-detail',
  imports: [],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.scss',
})
export class UsersDetailComponent implements OnInit {
  user?: Users;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private prefecturesService: PrefecturesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.usersService.requestGetUsersList(id).subscribe({
      next: (res: any) => {
        if (res.success) this.user = res.users as Users;
      },
    });
  }

  edit() {
    this.router.navigate(['./users-editor', this.user?.id]);
  }

  convertPrefectureName(id: number): string {
    return this.prefecturesService.convertPrefectureName(id);
  }

  returnPage() {
    this.router.navigate(['./users-list']);
  }
}
