import { Component, Input } from '@angular/core';

export interface IContextInfo {
  header: string;
  text: string;
}

@Component({
  selector: 'info-container',
  templateUrl: './info-container.component.html',
  styleUrls: ['./info-container.component.scss'],
})
export class InfoContainerComponent {
  @Input() infoMessage: IContextInfo | null = {
    header: 'Ведущий думает...',
    text: 'Ведущий придумывает ассоциацию и выбирает карту. Изучите свои карты',
  };
}
