import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GameStatus,
  IPlayerInfo,
  PlayerStatus,
} from 'src/app/interfaces/game.interfaces';
import {
  GameStateManagerService,
  GameStates,
} from 'src/app/services/game-state-manager.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
  public playersList: Observable<IPlayerInfo[] | null>;
  public isUserMaster: boolean;

  constructor(
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {
    this.playersList = this._gameStateManagerService.getPlayersList();
    this.isUserMaster = this._gameStateManagerService.isUserMaster;
  }

  ngOnInit(): void {}

  public setGameStatusToPlaying() {
    if (!this._gameStateManagerService.isUserMaster) {
      return;
    }
    this._requestService.emitMessage({ game_status: GameStatus.Playing });
    /*   this._requestService.emitMessage({ create_round: true }); */
  }

  public setReadyStatus() {
    if (!this._gameStateManagerService.playerId) {
      return;
    }
    this._requestService.emitMessage({
      status: PlayerStatus.Ready,
      player_id: this._gameStateManagerService.playerId,
    });
  }

  public setNotReadyStatus() {
    if (!this._gameStateManagerService.playerId) {
      return;
    }
    this._requestService.emitMessage({
      status: PlayerStatus.NotReady,
      player_id: this._gameStateManagerService.playerId,
    });
  }
}
