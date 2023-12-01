import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlayerInfo } from 'src/app/interfaces/game.interfaces';
import { ICard, IPlayer } from 'src/app/interfaces/round.interfaces';

const test = [
  { id: 9, url: '/media/cards/7.jpg' },
  { id: 15, url: '/media/cards/13.jpeg' },
  { id: 17, url: '/media/cards/15.jpeg' },
  { id: 19, url: '/media/cards/17.jpeg' },
];

const playersTest = [
  {
    id: '123',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: false,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: false,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: false,
  },
  {
    id: '123',
    avatar: 'lama',
    ready: false,
  },
];
@Component({
  selector: 'cards-panel',
  templateUrl: './cards-panel.component.html',
  styleUrls: ['./cards-panel.component.scss'],
})
export class CardsPanelComponent {
  @Input() cards: ICard[] | null = null;
  @Input() yourCardId: number = 17;

  @Input() players: IPlayerInfo[] | null = null;
  @Input() backOfCardUrl: string = '/media/cards/17.jpeg';

  @Output() cardSelect = new EventEmitter<number | null>();

  public selectedCard: number | null = null;

  public get readyPlayersNumber() {
    if (!this.players) {
      return 0;
    }
    return this.players.filter((player: IPlayerInfo) => player.ready).length;
  }

  public onCardClick(card: number): void {
    if (card === this.selectedCard || card === this.yourCardId) {
      this.selectedCard = null;
    } else {
      this.selectedCard = card;
    }
    this.cardSelect.emit(this.selectedCard);
  }

  public isCardPlaced(index: number): boolean {
    return index < this.readyPlayersNumber;
  }
}
