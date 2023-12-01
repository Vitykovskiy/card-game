import { Component, Input } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() url: string = '';
  @Input() selected = false;
  @Input() isYourCard = false;
  @Input() show = true;

  get cardUrl() {
    return 'https://game.ataman-club.ru' + this.url;
  }
}
