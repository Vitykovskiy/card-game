import { Component, OnInit } from '@angular/core';
import {
  StateManagerService,
  GameStates,
} from 'src/app/services/state-manager.service';

@Component({
  selector: 'room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.scss'],
})
export class RoomSettingsComponent implements OnInit {
  constructor(private stateManagerService: StateManagerService) {}
  ngOnInit() {
    this.stateManagerService.setState(GameStates.RoomSettings);
  }
}
