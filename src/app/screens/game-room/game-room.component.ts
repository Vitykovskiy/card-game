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
  public selectedCard = '';
  public playerCards: Observable<ICard[]>;
  public tableCards: Observable<ICard[]>;
  public leader: Observable<number | null>;
  public playerId: number | null;

  constructor(
    private _roundStateManagerService: RoundStateManagerService,
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
  ) {
    this.associationFrom = new FormGroup({
      association: new FormControl(null),
    });
    this.playerCards = this._roundStateManagerService.playerCards;
    this.tableCards = this._roundStateManagerService.tableCards;
    this.leader = this._roundStateManagerService.leader;
    this.playerId = this._gameStateManagerService.playerId;
  }

  public get players() {
    return this._roundStateManagerService.getPlayersObservable();
  }

  public get isMaster() {
    return this._gameStateManagerService.isUserMaster;
  }

  ngOnInit(): void {
    this._roundStateManagerService.onStartGame();
  }

  createRound() {
    this._roundStateManagerService.createRound();
  }

  sendChoice() {
    this._requestService.emitMessage({});
  }
}
