import { Component, OnInit } from '@angular/core';
import {
  GameStateManagerService,
  GameStates,
} from 'src/app/services/game-state-manager.service';

@Component({
  selector: 'deck-selection',
  templateUrl: './deck-selection.component.html',
  styleUrls: ['./deck-selection.component.scss'],
})
export class DeckSelectionComponent implements OnInit {
  public decksPreviews: string[] = [
    'card-example-1.JPG',
    'card-example-2.JPG',
    'card-example-3.JPG',
  ];
  public pathToImages = '../assets/images/';

  constructor(private stateManagerService: GameStateManagerService) {}

  ngOnInit() {
    this.stateManagerService.setState(GameStates.DeckSelection);
    this.decksPreviews = this.decksPreviews.map(
      (path: string) => this.pathToImages + path,
    );
  }
}
