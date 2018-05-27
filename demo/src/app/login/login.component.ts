import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeveloperFunction } from '@devmod/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: this.fb.control(''),
      password: this.fb.control('')
    });
  }

  submit() {
    const form = this.form.value;
    if (form.username === 'NextFaze' && form.password === 'devmod-development') {
      this.router.navigate(['/', 'dash']);
    } else {
      this.error = 'Incorrect details';
    }
  }

  @DeveloperFunction({
    args: [
      {
        username: 'NextFaze',
        password: 'devmod-development'
      }
    ]
  })
  autoFill(args: any) {
    this.form.patchValue(args);
  }

  @DeveloperFunction()
  autoLogin() {
    this.autoFill({ username: 'NextFaze', password: 'devmod-development' });
    this.submit();
  }
}
