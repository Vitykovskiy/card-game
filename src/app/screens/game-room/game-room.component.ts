import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICard } from 'src/app/interfaces/round.interfaces';
import { GameStateManagerService } from 'src/app/services/game-state-manager.service';
import { RequestService } from 'src/app/services/request.service';
import {
  RoundStateManagerService,
  RoundStep,
} from 'src/app/services/round-state-manager.service';

enum Options {
  AssociationCheckList = 'association-check-list',
  AssociationInput = 'association-input',
  AssociationText = 'association-text',
  ConfirmButtom = 'confirm-button',
  InfoMessage = 'info-message',
}

interface IContextInfo {
  header: string;
  text: string;
}

const InfoMessages = {
  [RoundStep.LeaderThinking]: {
    header: 'Ведущий думает...',
    text: 'Ведущий придумывает ассоциацию и выбирает карту. Изучите свои карты',
  },
  [RoundStep.ChooseAssociationCard]: {
    header: 'Выберите карту',
    text: 'Такую, чтобы сбить с толку других игроков и они выбрали вашу карту вместо карты ведущего',
  },
  [RoundStep.WaitPlayersAssociationCard]: {
    header: 'Ожидание игроков',
    text: 'Выбирают еще {{ null }} игроков',
  },
  [RoundStep.ChooseLeadersCard]: {
    header: 'Выберите карту',
    text: 'Которую, как вам кажется, положил ведущий',
  },
  [RoundStep.WaitPlayersLeadersCardChoise]: {
    header: 'Ожидание игроков',
    text: 'Выбирают еще {{ null }} игроков',
  },
};

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit {
  public selectedCard: number | null = null;
  public cardsInHand$: Observable<ICard[]>;
  public tableCards$: Observable<ICard[]>;
  public leader: number | null;
  public leader$: Observable<number | null>;
  public playerId: number | null;
  public associationText$: Observable<string | null>;

  public playerPanelOptions$: BehaviorSubject<Options[]>;
  public showInfoContainer$: BehaviorSubject<boolean>;
  public showHints$: BehaviorSubject<boolean>;
  public showAssociationText$: BehaviorSubject<boolean>;
  public showAssociationInput$: BehaviorSubject<boolean>;
  public showConfirmBtn$: BehaviorSubject<boolean>;

  public contextInfo$: BehaviorSubject<IContextInfo | null>;

  get isPlayerLeader() {
    return this.playerId === this.leader;
  }

  constructor(
    private _roundStateManagerService: RoundStateManagerService,
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {
    this.playerPanelOptions$ = new BehaviorSubject<Options[]>([]);
    this.showInfoContainer$ = new BehaviorSubject<boolean>(false);
    this.showHints$ = new BehaviorSubject<boolean>(false);
    this.showAssociationText$ = new BehaviorSubject<boolean>(false);
    this.showConfirmBtn$ = new BehaviorSubject<boolean>(false);
    this.showAssociationInput$ = new BehaviorSubject<boolean>(false);

    this.cardsInHand$ = this._roundStateManagerService.playerCards;
    this.tableCards$ = this._roundStateManagerService.tableCards;
    this.leader = this._roundStateManagerService.leader;
    this.leader$ = this._roundStateManagerService.getLeaderObservable();
    this.playerId = this._gameStateManagerService.playerId;
    this.associationText$ = this._roundStateManagerService.associationText;

    this.contextInfo$ = new BehaviorSubject<IContextInfo | null>(null);
  }

  ngOnInit(): void {
    this._roundStateManagerService.onStartGame();

    this._roundStateManagerService.roundStep.subscribe((step: RoundStep) => {
      switch (step) {
        case RoundStep.LeaderThinking:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.AssociationCheckList,
              Options.AssociationInput,
            ]);
          } else {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
        case RoundStep.ChooseAssociationCard:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          } else {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
        case RoundStep.WaitPlayersAssociationCard:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
        case RoundStep.ChooseLeadersCard:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
        case RoundStep.WaitPlayersLeadersCardChoise:
          if (!this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
        case RoundStep.RoundResults:
          if (this.isPlayerLeader) {
            this.playerPanelOptions$.next([
              Options.AssociationCheckList,
              Options.AssociationInput,
            ]);
          } else {
            this.playerPanelOptions$.next([
              Options.InfoMessage,
              Options.AssociationText,
            ]);
          }
          break;
      }
    });

    this.playerPanelOptions$.subscribe((options: Options[]) => {
      this._setSubjectValues(options);
    });
  }

  private _setSubjectValues(options: Options[]): void {
    const mapOptionToSubject = {
      [Options.AssociationCheckList]: this.showHints$,
      [Options.AssociationInput]: this.showAssociationInput$,
      [Options.AssociationText]: this.showAssociationText$,
      [Options.ConfirmButtom]: this.showConfirmBtn$,
      [Options.InfoMessage]: this.showInfoContainer$,
    };

    Object.keys(Options).forEach((key) => {
      if (options.includes(key as Options)) {
        mapOptionToSubject[key as Options].next(true);
      } else {
        mapOptionToSubject[key as Options].next(false);
      }
    });
  }

  sendAssociationByLeader() {
    this._requestService.emitMessage({
      /*       association_text: this.associationFrom.controls['association'].value,
      association_card: this.selectedCard, */
    });
  }

  sendAssociation() {
    this._requestService.emitMessage({
      association_card: this.selectedCard,
    });
  }

  chooseLeaderCard() {
    this._requestService.emitMessage({ choice: this.selectedCard });
  }

  public get players() {
    return this._roundStateManagerService.players;
  }

  public get isMaster() {
    return this._gameStateManagerService.isUserMaster;
  }

  public get isLeader() {
    return this._roundStateManagerService.leader;
  }

  onCardClick(card: number) {
    if (card === this.selectedCard) {
      this.selectedCard = null;
    } else {
      this.selectedCard = card;
    }
  }

  createRound() {
    this._roundStateManagerService.createRound();
  }
}
