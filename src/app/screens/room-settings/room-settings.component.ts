import { Component, OnInit } from '@angular/core';
import { Observable, map, mergeMap, mergeScan } from 'rxjs';
import {
  ICreatePlayerResponseDTO,
  PlayerStatus,
} from 'src/app/interfaces/game.interfaces';
import { RequestService } from 'src/app/services/request.service';
import {
  GameStateManagerService,
  GameStates,
} from 'src/app/services/game-state-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss'],
})
export class RoomSettingsComponent implements OnInit {
  private _decks: any;

  constructor(
    private _requestService: RequestService,
    private _gameStateManagerService: GameStateManagerService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._requestService.getDecksRequest().subscribe((data: any) => {
      this._decks = data;
    });
  }

  setReadyStatus(): void {
    //  this._requestService.setReadyStatus();
  }

  initGame(): void {
    this._initGame().subscribe();
  }

  public _initGame(): Observable<any> {
    console.log('initGame');
    if (this._gameStateManagerService.playerId) {
      return this._createGame(this._gameStateManagerService.playerId);
    }
    return this._requestService
      .createPlayer({
        avatar: 'lama',
        status: PlayerStatus.NotReady,
      })
      .pipe(
        mergeMap((data: ICreatePlayerResponseDTO) => {
          this._gameStateManagerService.playerId = data.id;
          return this._createGame(data.id);
        }),
      );
  }

  private _createGame(playerId: number): Observable<any> {
    return this._requestService
      .createGameRequest({
        creator: playerId,
        deck: this._decks[0].id,
        members_num: 4,
        points_to_win: 20,
      })
      .pipe(
        map((gameData) => {
          this._gameStateManagerService.gameId = gameData.id;
          this._gameStateManagerService.isUserMaster = true;
          this._requestService
            .connect(gameData.id, playerId)
            .subscribe((data) => {
              console.log('data', data);
            });
          this._gameStateManagerService.onCreateGame();
          this._router.navigate(['/waiting']);
        }),
      );
  }
}
