import { Component } from '@angular/core';
import { AdministratorService } from '../services/administrator.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private adminService: AdministratorService) {}

  getAdminName(): string {
    let name = '';
    let admin = this.adminService.getAdmin();

    if (admin.id != 0) {
      name = admin.name;
    }

    return name;
  }
}
