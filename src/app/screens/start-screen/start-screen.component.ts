import { Component, OnInit } from '@angular/core';
import {
  GameStates,
  StateManagerService,
} from 'src/app/services/state-manager.service';

@Component({
  selector: 'start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  constructor(private stateManagerService: StateManagerService) {}

  ngOnInit() {
    this.stateManagerService.setState(GameStates.Start);
  }
}
