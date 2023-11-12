import { Component, Input } from '@angular/core';

@Component({
  selector: 'info-container',
  templateUrl: './info-container.component.html',
  styleUrls: ['./info-container.component.scss'],
})
export class InfoContainerComponent {
  @Input() infoMessage: { header: string; text: string } = {
    header: 'Ведущий думает...',
    text: 'Ведущий придумывает ассоциацию и выбирает карту. Изучите свои карты',
  };
}
