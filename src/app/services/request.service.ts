/* import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private url = 'https://localhost:8000';
  private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {}

  connect() {
    this.socket$.next('connect');
  }

  disconnect() {
    this.socket$.complete();
  }

  listenToServerEvent(eventName: string) {
    return this.socket$.asObservable().pipe(
      filter((message) => message.event === eventName),
      map((message) => message.data),
    );
  }

  emitEvent(eventName: string, data: any) {
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
}
 */
