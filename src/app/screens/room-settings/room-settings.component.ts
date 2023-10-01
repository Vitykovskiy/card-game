import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerReadyStates, Status } from 'src/app/services/interfaces';
import { RequestService } from 'src/app/services/request.service';
import {
  StateManagerService,
  GameStates,
} from 'src/app/services/state-manager.service';

@Component({
  selector: 'room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss'],
})
export class RoomSettingsComponent implements OnInit {
  constructor(
    private _stateManagerService: StateManagerService,
    private _requestService: RequestService,
  ) {}
  ngOnInit() {
    this._stateManagerService.setState(GameStates.RoomSettings);
  }

  createPlayer(): void {
    this._requestService
      .createPlayer({
        game: undefined,
        avatar: 'lama',
        status: PlayerReadyStates.NotReady,
      })
      .subscribe((data) => {
        this._stateManagerService.playerId = data.id;
      });
  }

  createGame(): void {
    if (!this._stateManagerService.playerId) {
      console.warn('Player ID is empty');
      return;
    }

    this._requestService
      .createGame({
        creator: this._stateManagerService.playerId,
        deck: 1,
        members_num: 4,
        points_to_win: 40,
      })
      .subscribe((data) => {
        console.log('DATA!:', data);
        this._requestService.connect();
      });
  }
}
