import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  GameStatus,
  ICreateGameDTO,
  ICreatePlayerRequestDTO,
  ICreateReviewDTO,
} from '../interfaces/game.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private _url = 'https://game.ataman-club.ru/';
  // private _url = 'http://localhost:8000';
  // private _url = '';
  private _socketUrl = 'wss://game.ataman-club.ru/';

  private _socket$: WebSocketSubject<any> | undefined;

  constructor(private http: HttpClient) {}

  connect(gameId: number, playerId: number): Observable<any> {
    this._socket$ = new WebSocketSubject<any>(
      this._socketUrl + `ws/game/${gameId}/${playerId}/`,
    );
    return this._socket$.asObservable();
  }

  getWebsocketObservable(): Observable<any> | null {
    if (!this._socket$) {
      return null;
    }
    return this._socket$.asObservable();
  }

  disconnect() {
    if (this._socket$) {
      this._socket$.complete();
    }
  }

  emitMessage(message: any): void {
    if (!this._socket$) {
      return;
    }
    console.log('EMIT MESSAGE', message);
    this._socket$.next(message);
  }

  get(endpoint: string) {
    return this.http.get(this._url + endpoint);
  }

  post(endpoint: string, body: any) {
    return this.http.post(this._url + endpoint, body);
  }

  public put(endpoint: string, body: any) {
    return this.http.put(this._url + endpoint, body);
  }

  public createGameRequest(gameOptions: ICreateGameDTO): Observable<any> {
    return this.post('api/game/create/', gameOptions);
  }

  public createPlayer(player: ICreatePlayerRequestDTO): Observable<any> {
    return this.post('api/player/create/', player);
  }

  public createReview(review: ICreateReviewDTO): Observable<any> {
    return this.post('api/review/create/', review);
  }

  public getDecksRequest(): any {
    return this.get('api/deck_list/');
  }

  /*     public initGame(): Observable<any> {
    if (this._gameStateManagerService.playerId) {
      return this._createGame(this._gameStateManagerService.playerId);
    }
    return this.createPlayer({
      avatar: 'lama',
      status: PlayerStatus.Ready,
    }).pipe(
      mergeMap((data: ICreatePlayerResponseDTO) => {
        this._gameStateManagerService.playerId = data.id;
        return this._createGame(data.id);
      }),
    );
  }

  private _createGame(playerId: number): Observable<any> {
    return this.createGameRequest({
      creator: playerId,
      deck: 1,
      members_num: 4,
      points_to_win: 40,
    }).pipe(
      map((gameData) => {
        this._gameStateManagerService.gameId = gameData.id;
      }),
    );
  } */

  public startPlaying() {
    this.emitMessage({
      game_status: GameStatus.Playing,
    });
  }

  public createRound() {
    this.emitMessage({
      create_round: true,
    });
  }

  /*   public onStartRound(roundData: IStartRoundData) {
    this._gameStateManagerService;
  }  */
}
