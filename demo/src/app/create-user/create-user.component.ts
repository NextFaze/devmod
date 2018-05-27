import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DeveloperFunction } from '@devmod/core';

import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  form: FormGroup;

  constructor(
    private userService: UsersService,
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {}

  get hasData() {
    return this.data && this.data.user;
  }

  submit(event: any) {
    event.stopPropagation();
    if (this.form.valid) {
      if (this.hasData) {
        this.userService.updateUser(this.form.value);
        this.dialog.close();
      } else {
        this.userService.createUser(this.form.value);
        this.dialog.close();
      }
    }
    return false;
  }

  @DeveloperFunction({
    label: 'Autofill - Alt+Click to Customize',
    args: [
      {
        name: 'Marty McFly',
        email: 'mmcfly@example.com',
        phone: '555-3226'
      }
    ]
  })
  autofill(data: any) {
    this.form.patchValue(data);
  }

  cancel(event: any) {
    this.dialog.close();
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: this.fb.control(Math.random(), Validators.required),
      name: this.fb.control('', Validators.required),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', Validators.required)
    });
    if (this.hasData) {
      this.form.reset(this.data.user);
    }
  }
}
