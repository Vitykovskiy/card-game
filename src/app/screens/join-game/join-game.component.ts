import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  ICreatePlayerRequestDTO,
  PlayerStatus,
} from 'src/app/interfaces/game.interfaces';
import { RequestService } from 'src/app/services/request.service';
import {
  GameStates,
  GameStateManagerService,
} from 'src/app/services/game-state-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent {
  public joinForm: FormGroup;

  constructor(
    private _gameStateManagerService: GameStateManagerService,
    private _requestService: RequestService,
    private router: Router,
  ) {
    this.joinForm = new FormGroup({
      gameId: new FormControl(null),
    });
  }

  ngOnInit() {
    this._gameStateManagerService.setState(GameStates.JoinGame);
  }

  onSubmit() {
    this._gameStateManagerService.gameId = this.joinForm.value.gameId;
    const playerData = {
      game: this._gameStateManagerService.gameId,
      avatar: 'tiger',
      status: PlayerStatus.NotReady,
    } as ICreatePlayerRequestDTO;

    this._requestService.createPlayer(playerData).subscribe((playerData) => {
      this._gameStateManagerService.playerId = playerData.id;
      if (!this._gameStateManagerService.gameId || !playerData.id) {
        return;
      }
      console.log(
        'PLAYER_ID',
        playerData.id,
        'GAME_ID',
        this._gameStateManagerService.gameId,
      );
      this._requestService.connect(
        this._gameStateManagerService.gameId,
        playerData.id,
      );
      this._gameStateManagerService.onCreateGame();
      this.router.navigate(['/waiting']);
    });
  }
}
