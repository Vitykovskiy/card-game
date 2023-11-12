import { Component, Input } from '@angular/core';

@Component({
  selector: 'numeric-input',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
})
export class NumericInputComponent {
  @Input() counter: number = 0;

  public increase(): void {
    this.counter++;
  }

  public decrease(): void {
    if (this.counter > 0) {
      this.counter--;
    }
  }
}
