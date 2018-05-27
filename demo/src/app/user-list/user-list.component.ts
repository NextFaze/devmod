import { Component, Output, OnInit, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() users: any[];
  @Output() edit = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
