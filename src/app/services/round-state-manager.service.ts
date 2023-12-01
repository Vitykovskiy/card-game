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
  RoundDataTypes as RoundDataType,
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

  public getRoundStepObservable(): Observable<RoundStep> {
    return this._roundStep.asObservable();
  }

  public set roundStep(state: RoundStep) {
    this._roundStep.next(state);
  }

  public get roundStep() {
    return this._roundStep.getValue();
  }

  public getPlayerCardsObservable(): Observable<ICard[]> {
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

  public getTableCardsObservable(): Observable<ICard[]> {
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

  public getPlayersObservbale(): Observable<IPlayer[]> {
    return this._players.asObservable();
  }

  public getAssociationTextObservable(): Observable<string | null> {
    return this._associationText.asObservable();
  }

  public changeGameStatusToPlaying() {
    this._requestService.emitMessage({
      game_status: GameStatus.Playing,
    });
  }

  public createRound() {
    this._requestService.emitMessage({
      create_round: true,
    });
  }

  // Round hooks
  public onStartGame(): void {
    this._websocketObservable = this._requestService.getWebsocketObservable();
    if (!this._websocketObservable) {
      return;
    }
    this._websocketObservable.subscribe((data: any) => {
      switch (checkRoundDataType(data)) {
        case RoundDataType.StartData:
          this._onStartRound(data as IStartRoundData);
          this.roundStep = RoundStep.LeaderThinking;
          break;
        case RoundDataType.AssociationReceived:
          this._onAssociationReceived(data);
          this.roundStep = RoundStep.ChooseAssociationCard;
          break;
        case RoundDataType.SelectedCardsData:
          this._onGetCards(data as ISelectedCards);
          this.roundStep = RoundStep.ChooseLeadersCard;
          break;
        case RoundDataType.ResultData:
          this._onFinishRound(data as IResultRoundData);
          this.roundStep = RoundStep.RoundResults;
          break;
        case RoundDataType.PlayersStatusData:
          const players = this._players.getValue().map((playerData) => {
            if (playerData.id) {
              const newPlayersStatus = data[playerData.id];
              if (newPlayersStatus !== undefined) {
                playerData.status = newPlayersStatus;
              }
            }
            return playerData;
          });
          this._players.next(players);
      }
    });
  }

  private _onStartRound(roundData: IStartRoundData) {
    this.roundStep = RoundStep.LeaderThinking;
    this._leader.next(roundData.leader_id);
    this._playerCards.next(roundData.player_cards);
    const players = Object.keys(roundData.players).map((id) => {
      return {
        id: id,
        ...roundData.players[id],
      };
    });
    this._players.next(players);
    this._gameStateManagerService.setGameStatus(roundData.game_status);
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
