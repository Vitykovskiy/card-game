import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICard } from 'src/app/interfaces/round.interfaces';
import { GameStateManagerService } from 'src/app/services/game-state-manager.service';
import { RequestService } from 'src/app/services/request.service';
import { RoundStateManagerService } from 'src/app/services/round-state-manager.service';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit {
  public associationFrom: FormGroup;
  public selectedCard: number | null = null;
  public playerCards$: Observable<ICard[]>;
  public tableCards$: Observable<ICard[]>;
  public leader: number | null;
  public leader$: Observable<number | null>;
  public playerId: number | null;
  public associationText$: Observable<string | null>;

  constructor(
    private _roundStateManagerService: RoundStateManagerService,
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {
    this.associationFrom = new FormGroup({
      association: new FormControl(null),
    });
    this.playerCards$ = this._roundStateManagerService.playerCards;
    this.tableCards$ = this._roundStateManagerService.tableCards;
    this.leader = this._roundStateManagerService.leader;
    this.leader$ = this._roundStateManagerService.getLeaderObservable();
    this.playerId = this._gameStateManagerService.playerId;
    this.associationText$ = this._roundStateManagerService.associationText;
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

  ngOnInit(): void {
    this._roundStateManagerService.onStartGame();
  }

  createRound() {
    this._roundStateManagerService.createRound();
  }

  chooseLeaderCard() {
    this._requestService.emitMessage({ choice: this.selectedCard });
  }

  sendAssociation() {
    this._requestService.emitMessage({
      association_card: this.selectedCard,
    });
  }

  sendAssociationByLeader() {
    this._requestService.emitMessage({
      association_text: this.associationFrom.controls['association'].value,
      association_card: this.selectedCard,
    });
  }
}
