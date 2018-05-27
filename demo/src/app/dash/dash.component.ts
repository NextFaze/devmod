import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeveloperFunction } from '@devmod/core';
import { Observable, of } from 'rxjs';

import { CreateUserComponent } from '../create-user/create-user.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  title = 'Devmod Interface Module Demo';
  users: Observable<any[]>;
  private _debugEmpty;

  constructor(private userService: UsersService, private dialog: MatDialog) {}

  @DeveloperFunction()
  sortTitleAlphabetically() {
    this.title = this.title
      .split('')
      .sort()
      .join('');
  }

  @DeveloperFunction()
  toggleEmptyState() {
    this.users = this._debugEmpty ? this.userService.getUsers() : of([]);
    this._debugEmpty = !this._debugEmpty;
  }

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  create() {
    this.dialog.open(CreateUserComponent);
  }

  edit(user: any) {
    this.dialog.open(CreateUserComponent, {
      data: { user }
    });
  }
}
