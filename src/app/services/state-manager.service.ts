import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum GameStates {
  Start = 'start',
  DeckSelection = 'deck-selection',
  RoomSettings = 'room-settings',
}

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  public currentState: Observable<string | null>;
  private _stateSource: BehaviorSubject<string | null>;
  private _currentDeck: BehaviorSubject<string | null>;
  private _roomId: BehaviorSubject<string | null>;

  constructor() {
    this._stateSource = new BehaviorSubject<string | null>(null);
    this._currentDeck = new BehaviorSubject<string | null>(null);
    this._roomId = new BehaviorSubject<string | null>(null);
    this.currentState = this._stateSource.asObservable();
  }

  setState(state: string) {
    this._stateSource.next(state);
  }

  setCurrentDeck(deckId: string) {}
}
