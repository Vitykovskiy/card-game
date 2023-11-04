import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GameDataTypes,
  GameStatus,
  IPlayerInfo,
  checkGameDataType,
  convertPlayersList,
} from '../interfaces/game.interfaces';
import { RequestService } from './request.service';
import { Router } from '@angular/router';

export enum GameStates {
  Start = 'start',
  DeckSelection = 'deck-selection',
  RoomSettings = 'room-settings',
  JoinGame = 'join-game',
  PlayRoom = 'play-room',
}

/* const TEST_PLAYERS_LIST = [
  {
    id: '1',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '1',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '1',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '1',
    avatar: 'lama',
    ready: true,
  },
  {
    id: '1',
    avatar: 'lama',
    ready: true,
  },
]; */

@Injectable({
  providedIn: 'root',
})
export class GameStateManagerService {
  private _stateSource: BehaviorSubject<string | null>;
  private _currentDeck: BehaviorSubject<number | null>;
  private _gameId: BehaviorSubject<number | null>;
  private _userId: number | null = null;

  private _isUserMaster = false;
  private _gameStatus = new BehaviorSubject<GameStatus>(GameStatus.None);
  private _players = new BehaviorSubject<IPlayerInfo[] | null>([]);

  private _websocketObservable: Observable<any> | null = null;

  public currentState: Observable<string | null>;

  public set playerId(id: number) {
    this._userId = id;
  }

  public get playerId(): number | null {
    return this._userId;
  }

  public set gameId(id: number) {
    this._gameId.next(id);
  }

  public get gameId(): number | null {
    return this._gameId.getValue();
  }

  public set isUserMaster(value: boolean) {
    this._isUserMaster = value;
  }

  public get isUserMaster(): boolean {
    return this._isUserMaster;
  }

  constructor(
    private _requestService: RequestService,
    private _router: Router,
  ) {
    this._stateSource = new BehaviorSubject<string | null>(null);
    this._currentDeck = new BehaviorSubject<number | null>(null);
    this._gameId = new BehaviorSubject<number | null>(null);
    this.currentState = this._stateSource.asObservable();
  }

  public getGameIdObservable(): Observable<number | null> {
    return this._gameId.asObservable();
  }

  public onCreateGame(): void {
    this._websocketObservable = this._requestService.getWebsocketObservable();
    if (!this._websocketObservable) {
      return;
    }
    this._websocketObservable.subscribe((data: any) => {
      console.log('GameStateManagerService data', data);
      switch (checkGameDataType(data)) {
        case GameDataTypes.WaitingGameData:
          this.setGameStatus(data.isReadyToPlay);
          this.updatePlayersList(
            convertPlayersList(data.members) as IPlayerInfo[],
          );
          break;
        case GameDataTypes.GameStartedState:
          if (data.game_started) {
            this._router.navigate(['/game']);
          }
      }
    });
  }

  public updatePlayersList(playersList: IPlayerInfo[]) {
    this._players.next(playersList);
  }

  public getPlayersList(): Observable<IPlayerInfo[] | null> {
    return this._players.asObservable();
  }

  public setGameStatus(value: GameStatus) {
    this._gameStatus.next(value);
  }

  public getGameStatusObservable(): Observable<GameStatus> {
    return this._gameStatus.asObservable();
  }
  /*
  public setUserMasterState(value: boolean): void {
    this._isUserMaster.next(value);
  }

   public isUserMaster(): boolean {
    return this._isUserMaster.getValue();
  }

  public isUserMasterObservable(): Observable<boolean> {
    return this._isUserMaster.asObservable();
  } */

  public setCurrentDeck(deckId: number): void {
    this._currentDeck.next(deckId);
  }

  public setState(state: string) {
    this._stateSource.next(state);
  }
}
