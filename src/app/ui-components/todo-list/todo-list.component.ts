import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @Input() checkListItems = new BehaviorSubject<
    { text: string; done: boolean }[]
  >([]);

  ngOnInit(): void {
    this.checkListItems.next([
      { text: 'Выберите карту для ассоциации', done: false },
      { text: 'Напишите ассоциацию в поле справа', done: false },
    ]);
  }
}
