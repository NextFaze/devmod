import { Injectable } from '@angular/core';
import { DeveloperFunction } from '@devmod/core';
import * as faker from 'faker';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = new BehaviorSubject([]);

  constructor() {}

  getUsers(count: number = 3) {
    this.users.next(
      this.users.value.concat(new Array(3).fill('').map((item, id) => this.getUserData(id)))
    );
    return this.users.pipe(delay(500));
  }

  createUser(user: any) {
    this.users.next(this.users.value.concat(user));
  }

  updateUser(updated: any) {
    const user = this.users.value.find(item => item.id === updated.id);
    Object.assign(user, updated);
    this.users.next(this.users.value);
  }

  @DeveloperFunction()
  fakeLotsOfUsers() {
    this.users.next(
      this.users.value.concat(
        this.users.value.concat(new Array(100).fill('').map((_, id) => this.getUserData(id)))
      )
    );
  }

  getUserData(id: number) {
    return {
      id,
      ...faker.helpers.createCard()
    };
  }
}
