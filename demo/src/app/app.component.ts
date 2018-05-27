import { Component } from '@angular/core';
import { DeveloperCategory, DeveloperFunction } from '@devmod/core';
import { Router } from '@angular/router';

@DeveloperCategory({
  name: 'Application Wide',
  sort: 0
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {}

  @DeveloperFunction()
  skipLogin() {
    this.router.navigate(['/', 'dash']);
  }

  @DeveloperFunction()
  logout() {
    this.router.navigate(['/', 'login']);
  }
}
