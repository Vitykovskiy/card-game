import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICard } from 'src/app/interfaces/round.interfaces';
import { GameStateManagerService } from 'src/app/services/game-state-manager.service';
import { RequestService } from 'src/app/services/request.service';
import {
  RoundStateManagerService,
  RoundStep,
} from 'src/app/services/round-state-manager.service';
import { IContextInfo } from 'src/app/widgets/info-container/info-container.component';
import { ITodoItem } from 'src/app/widgets/todo-list/todo-list.component';

enum WidgetType {
  AssociationCheckList = 'association-check-list',
  AssociationInput = 'association-input',
  AssociationText = 'association-text',
  ConfirmButtom = 'confirm-button',
  InfoMessage = 'info-message',
}

const CREATE_ASSOCIATION_CHECK_LIST = [
  { type: 'card', text: 'Выберите карту для ассоциации', done: false },
  { type: 'text', text: 'Напишите ассоциацию в поле справа', done: false },
];

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit {
  public cardsInHand$: Observable<ICard[]>;
  public selectedCard$: BehaviorSubject<number | null>;
  public tableCards$: Observable<ICard[]>;
  public leader$: Observable<number | null>;
  public playerId: number | null;
  public associationText$: Observable<string | null>;

  public playerPanelOptions$: BehaviorSubject<WidgetType[]>;
  public showInfoContainer$: BehaviorSubject<boolean>;
  public showHints$: BehaviorSubject<boolean>;
  public showAssociationText$: BehaviorSubject<boolean>;
  public showAssociationInput$: BehaviorSubject<boolean>;
  public showConfirmBtn$: BehaviorSubject<boolean>;

  public contextInfo$: BehaviorSubject<IContextInfo | null>;

  //Leader properites
  public checkListItems$: BehaviorSubject<ITodoItem[]>;
  public preliminaryAssociationText: string | null;
  public preliminaryAssociationCard: number | null;
  public currentRoundStep: RoundStep;

  constructor(
    private _roundStateManagerService: RoundStateManagerService,
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {
    this.playerPanelOptions$ = new BehaviorSubject<WidgetType[]>([]);
    this.showInfoContainer$ = new BehaviorSubject<boolean>(false);
    this.showHints$ = new BehaviorSubject<boolean>(false);
    this.showAssociationText$ = new BehaviorSubject<boolean>(false);
    this.showConfirmBtn$ = new BehaviorSubject<boolean>(false);
    this.showAssociationInput$ = new BehaviorSubject<boolean>(false);

    this.selectedCard$ = new BehaviorSubject<number | null>(null);
    this.cardsInHand$ = this._roundStateManagerService.playerCards;
    this.tableCards$ = this._roundStateManagerService.tableCards;
    this.leader$ = this._roundStateManagerService.getLeaderObservable();
    this.playerId = this._gameStateManagerService.playerId;
    this.associationText$ = this._roundStateManagerService.associationText;

    this.contextInfo$ = new BehaviorSubject<IContextInfo | null>(null);

    this.checkListItems$ = new BehaviorSubject<ITodoItem[]>(
      CREATE_ASSOCIATION_CHECK_LIST,
    );
    this.preliminaryAssociationText = null;
    this.preliminaryAssociationCard = null;

    this.currentRoundStep = RoundStep.LeaderThinking;
  }

  get isPlayerLeader() {
    return this.playerId === this.leader;
  }

  public get players() {
    return this._roundStateManagerService.players;
  }

  public get isMaster() {
    return this._gameStateManagerService.isUserMaster;
  }

  public get leader() {
    return this._roundStateManagerService.leader;
  }

  ngOnInit(): void {
    this._roundStateManagerService.onStartGame();
    this._roundStateManagerService.roundStep.subscribe((step: RoundStep) => {
      this.currentRoundStep = step;
      switch (step) {
        case RoundStep.LeaderThinking:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.AssociationCheckList,
              WidgetType.AssociationInput,
            ]);
          } else {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
        case RoundStep.ChooseAssociationCard:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          } else {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
        case RoundStep.WaitPlayersAssociationCard:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
        case RoundStep.ChooseLeadersCard:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
        case RoundStep.WaitPlayersLeadersCardChoise:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
        case RoundStep.RoundResults:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              WidgetType.AssociationCheckList,
              WidgetType.AssociationInput,
            ]);
          } else {
            this.playerPanelOptions$.next([
              WidgetType.InfoMessage,
              WidgetType.AssociationText,
            ]);
          }
          break;
      }
      this.contextInfo$.next(this._getRoundStepContextInfo(step));
    });

    this.playerPanelOptions$.subscribe((widgets: WidgetType[]) => {
      this._showWidgets(widgets);
    });

    this.selectedCard$.subscribe((card: number | null) => {
      if (this.isPlayerLeader) {
        if (this.currentRoundStep === RoundStep.LeaderThinking) {
          this.preliminaryAssociationCard = card;
          const checkListItems = this.checkListItems$.getValue();
          const cardState = checkListItems.find((item) => item.type === 'card');
          if (cardState) {
            cardState.done = card ? true : false;
          }
          this.checkLeaderAssociationIsReadyToSend();
        }
      } else {
      }
    });
  }

  public sendAssociationByLeader() {
    this._requestService.emitMessage({
      association_text: this.preliminaryAssociationText,
      association_card: this.selectedCard$.getValue(),
    });
  }

  public sendAssociation() {
    this._requestService.emitMessage({
      association_card: this.selectedCard$.getValue(),
    });
  }

  public chooseLeaderCard() {
    this._requestService.emitMessage({ choice: this.selectedCard$.getValue() });
  }

  public onCardClick(card: number) {
    if (card === this.selectedCard$.getValue()) {
      this.selectedCard$.next(null);
    } else {
      this.selectedCard$.next(card);
    }
  }

  public createRound() {
    this._roundStateManagerService.createRound();
  }

  public onSaveAssociationText(text: any) {
    this.preliminaryAssociationText = text;

    const checkListItems = this.checkListItems$.getValue();
    const textState = checkListItems.find((item) => item.type === 'text');
    if (textState) {
      textState.done = true;
    }
    this.checkListItems$.next(checkListItems);
    this.checkLeaderAssociationIsReadyToSend();
  }

  public onEditAssociationText() {
    this.preliminaryAssociationText = null;
    const checkListItems = this.checkListItems$.getValue();
    const textState = checkListItems.find((item) => item.type === 'text');
    if (textState) {
      textState.done = false;
    }
    this.checkListItems$.next(checkListItems);
    this.checkLeaderAssociationIsReadyToSend();
  }

  public checkLeaderAssociationIsReadyToSend() {
    if (this.isPlayerLeader) {
      if (this.preliminaryAssociationText && this.preliminaryAssociationCard) {
        this._showWidgets([
          WidgetType.AssociationInput,
          WidgetType.ConfirmButtom,
        ]);
      } else {
        this._showWidgets([
          WidgetType.AssociationCheckList,
          WidgetType.AssociationInput,
        ]);
      }
    }
  }

  private _showWidgets(widgets: WidgetType[]): void {
    const mapOptionToSubject = {
      [WidgetType.AssociationCheckList]: this.showHints$,
      [WidgetType.AssociationInput]: this.showAssociationInput$,
      [WidgetType.AssociationText]: this.showAssociationText$,
      [WidgetType.ConfirmButtom]: this.showConfirmBtn$,
      [WidgetType.InfoMessage]: this.showInfoContainer$,
    };

    Object.keys(mapOptionToSubject).forEach((key) => {
      if (widgets.includes(key as WidgetType)) {
        mapOptionToSubject[key as WidgetType].next(true);
      } else {
        mapOptionToSubject[key as WidgetType].next(false);
      }
    });
  }

  private _getRoundStepContextInfo(step: RoundStep): IContextInfo | null {
    switch (step) {
      case RoundStep.LeaderThinking:
        return {
          header: 'Ведущий думает...',
          text: 'Ведущий придумывает ассоциацию и выбирает карту. Изучите свои карты',
        };
      case RoundStep.ChooseAssociationCard:
        return {
          header: 'Выберите карту',
          text: 'Такую, чтобы сбить с толку других игроков и они выбрали вашу карту вместо карты ведущего',
        };
      case RoundStep.WaitPlayersAssociationCard:
        return {
          header: 'Ожидание игроков',
          text: `Выбирают еще ${null} игроков`,
        };
      case RoundStep.ChooseLeadersCard:
        return {
          header: 'Выберите карту',
          text: 'Которую, как вам кажется, положил ведущий',
        };

      case RoundStep.WaitPlayersLeadersCardChoise:
        return {
          header: 'Ожидание игроков',
          text: `Выбирают еще ${null} игроков`,
        };
      default:
        return null;
    }
  }
}
