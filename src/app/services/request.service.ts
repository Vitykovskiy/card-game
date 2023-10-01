import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ICreateGameRequestDTO,
  ICreatePlayerDTO,
  ICreateReviewDTO,
} from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  // private url = 'http://game.ataman-club.ru';
  private url = 'http://localhost:8000';
  private socket$: WebSocketSubject<any> | undefined;

  constructor(private http: HttpClient) {}

  connect() {
    if (!this.socket$) {
      this.socket$ = webSocket('ws://localhost:8000');
    }
  }

  disconnect() {
    if (!this.socket$) {
      return;
    }
    this.socket$.complete();
  }

  listenToServerEvent(eventName: string) {
    if (!this.socket$) {
      return;
    }
    return this.socket$.asObservable().pipe(
      filter((message) => message.event === eventName),
      map((message) => message.data),
    );
  }

  emitEvent(eventName: string, data: any) {
    if (!this.socket$) {
      return;
    }
    const message = { event: eventName, data };
    this.socket$.next(message);
  }

  get(endpoint: string) {
    return this.http.get(`${this.url}/${endpoint}`);
  }

  post(endpoint: string, body: any) {
    return this.http.post(`${this.url}/${endpoint}`, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(`${this.url}/${endpoint}`, body);
  }

  createGame(newGameOptions: ICreateGameRequestDTO): Observable<any> {
    return this.post('api/game/create/', newGameOptions);
  }

  createPlayer(player: ICreatePlayerDTO): Observable<any> {
    return this.post('api/player/create/', player);
  }

  createReview(review: ICreateReviewDTO): Observable<any> {
    return this.post('api/review/create/', review);
  }
}
