import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GameStateManagerService } from './game-state-manager.service';
import { RequestService } from './request.service';
import { GameStatus } from '../interfaces/game.interfaces';
import {
  ICard,
  IPlayer,
  IResultRoundData,
  ISelectedCards,
  IStartRoundData,
  RoundDataTypes,
  checkRoundDataType,
  transformCardsObjectToArray,
} from '../interfaces/round.interfaces';

export enum GameStates {
  Start = 'start',
  DeckSelection = 'deck-selection',
  RoomSettings = 'room-settings',
  JoinGame = 'join-game',
  PlayRoom = 'play-room',
}

@Injectable({
  providedIn: 'root',
})
export class RoundStateManagerService implements OnInit {
  private _associationText = new BehaviorSubject<string | null>(null);
  private _associationCard = new BehaviorSubject<number | null>(null);

  private _leader = new BehaviorSubject<number | null>(null);

  private _yourCard = new BehaviorSubject<number | null>(null);
  private _roundResult = new BehaviorSubject<IResultRoundData | null>(null);

  private _players = new BehaviorSubject<IPlayer[]>([]);
  private _tableCards = new BehaviorSubject<ISelectedCards | null>(null);
  private _playerCards = new BehaviorSubject<{ [key: string]: string } | null>({
    4: '/media/cards/2.jpg',
    5: '/media/cards/3.jpg',
    9: '/media/cards/7.jpg',
    15: '/media/cards/13.jpeg',
  });

  private _websocketObservable: Observable<any> | null = null;

  constructor(
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {}

  ngOnInit(): void {
    this.onStartGame();
  }

  public get playerCards(): Observable<ICard[]> {
    return this._playerCards
      .asObservable()
      .pipe(map((value) => transformCardsObjectToArray(value)));
  }

  public get leader(): Observable<number | null> {
    return this._leader.asObservable();
  }

  public get tableCards(): Observable<ICard[]> {
    return this._tableCards.asObservable().pipe(
      map((value) => {
        if (!value) {
          return [];
        }
        this._yourCard.next(value.your_card);
        return transformCardsObjectToArray(value.placeCards);
      }),
    );
  }

  public getPlayersObservable(): Observable<IPlayer[]> {
    return this._players.asObservable();
  }

  public setGameStatusToPlaying() {
    this._requestService.emitMessage({
      game_status: GameStatus.Playing,
    });
  }

  public createRound() {
    this._requestService.emitMessage({
      create_round: true,
    });
  }

  public selectCard(card: number) {
    this._requestService.emitMessage({
      association_card: card,
    });
  }

  public setAssociationByLeader(card?: number, text?: string) {
    const association = {} as any;
    if (card) {
      association.association_card = card;
      this._associationCard.next(card);
    }
    if (text) {
      association.association_text = text;
      this._associationText.next(text);
    }
    this._requestService.emitMessage(association);
  }

  // Round hooks

  public onStartGame(): void {
    this._websocketObservable = this._requestService.getWebsocketObservable();
    if (!this._websocketObservable) {
      return;
    }
    this._websocketObservable.subscribe((data: any) => {
      switch (checkRoundDataType(data)) {
        case RoundDataTypes.StartData:
          this._onStartRound(data as IStartRoundData);
          break;
        case RoundDataTypes.ResultData:
          this._onFinishRound(data as IResultRoundData);
          break;
        case RoundDataTypes.SelectedCardsData:
          this._onGetCards(data as ISelectedCards);
          break;
      }
    });
  }

  private _onStartRound(roundData: IStartRoundData) {
    console.log('_onStartRound');
    this._gameStateManagerService.setGameStatus(roundData.game_status);
    this._leader.next(roundData.leader_id);
    this._playerCards.next(roundData.player_cards);
    const players = Object.keys(roundData.players).map((id) => {
      return {
        id: id,
        ...roundData.players[id],
      };
    });
    this._players.next(players);
  }

  private _onFinishRound(roundData: IResultRoundData) {
    console.log('_onFinishRound');
    this._roundResult.next(roundData);
  }

  private _onGetCards(selectedCards: ISelectedCards) {
    console.log('_onGetCards');
    this._tableCards.next(selectedCards);
  }
}
