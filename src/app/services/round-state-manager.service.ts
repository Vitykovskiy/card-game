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

export enum RoundStep {
  None,
  LeaderThinking,
  ChooseAssociationCard,
  WaitPlayersAssociationCard,
  ChooseLeadersCard,
  WaitPlayersLeadersCardChoise,
  RoundResults,
}

@Injectable({
  providedIn: 'root',
})
export class RoundStateManagerService implements OnInit {
  private _roundStep = new BehaviorSubject<RoundStep>(RoundStep.None);

  private _leader = new BehaviorSubject<number | null>(null);
  private _leaderAssociationText = new BehaviorSubject<string | null>(null);
  private _leaderAssociationCard = new BehaviorSubject<number | null>(null);

  private _associationText = new BehaviorSubject<string | null>(null);

  private _yourCard = new BehaviorSubject<number | null>(null);
  private _roundResult = new BehaviorSubject<IResultRoundData | null>(null);

  private _players = new BehaviorSubject<IPlayer[]>([]);
  private _tableCards = new BehaviorSubject<ISelectedCards | null>(null);
  private _playerCards = new BehaviorSubject<{ [key: string]: string } | null>(
    null,
  );

  private _websocketObservable: Observable<any> | null = null;

  constructor(
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {}

  ngOnInit(): void {
    this.onStartGame();
  }

  public get roundStep(): Observable<RoundStep> {
    return this._roundStep.asObservable();
  }

  public set roundStep(state: RoundStep) {
    this._roundStep.next(state);
  }

  public get playerCards(): Observable<ICard[]> {
    return this._playerCards
      .asObservable()
      .pipe(map((value) => transformCardsObjectToArray(value)));
  }

  public get leader(): number | null {
    return this._leader.getValue();
  }

  public getLeaderObservable(): Observable<number | null> {
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

  public get players(): Observable<IPlayer[]> {
    return this._players.asObservable();
  }

  public get associationText(): Observable<string | null> {
    return this._associationText.asObservable();
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
      this._leaderAssociationCard.next(card);
    }
    if (text) {
      association.association_text = text;
      this._leaderAssociationText.next(text);
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
          this.roundStep = RoundStep.LeaderThinking;
          this._onStartRound(data as IStartRoundData);
          break;
        case RoundDataTypes.AssociationReceived:
          this.roundStep = RoundStep.ChooseAssociationCard;
          this._onAssociationReceived(data);
          break;
        case RoundDataTypes.SelectedCardsData:
          this.roundStep = RoundStep.ChooseLeadersCard;
          this._onGetCards(data as ISelectedCards);
          break;
        case RoundDataTypes.ResultData:
          this.roundStep = RoundStep.RoundResults;
          this._onFinishRound(data as IResultRoundData);
          break;
      }
    });
  }

  private _onStartRound(roundData: IStartRoundData) {
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
    this._roundResult.next(roundData);
  }

  private _onGetCards(selectedCards: ISelectedCards) {
    this._tableCards.next(selectedCards);
  }

  private _onAssociationReceived(data: { association_text: string }) {
    this._associationText.next(data.association_text);
  }
}
