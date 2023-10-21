import { Component, OnInit } from '@angular/core';
import {
  GameStates,
  GameStateManagerService,
} from 'src/app/services/game-state-manager.service';

@Component({
  selector: 'start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  constructor(private _gameStateManagerService: GameStateManagerService) {}

  ngOnInit() {
    this._gameStateManagerService.setState(GameStates.Start);
  }
}
