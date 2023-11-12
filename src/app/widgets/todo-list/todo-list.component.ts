import { Component, Input } from '@angular/core';

export interface ITodoItem {
  type: string;
  text: string;
  done: boolean;
}

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  @Input() checkListItems: ITodoItem[] | null = [];
}
