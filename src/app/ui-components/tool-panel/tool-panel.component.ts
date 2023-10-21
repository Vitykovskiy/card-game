import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GameStateManagerService } from 'src/app/services/game-state-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss'],
})
export class ToolPanelComponent {
  constructor(
    private location: Location,
    private _gameStateManagerService: GameStateManagerService,
  ) {}

  get currentState(): Observable<string | null> {
    return this._gameStateManagerService.currentState;
  }

  goBack() {
    this.location.back();
  }
}
