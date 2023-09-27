import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss'],
})
export class ToolPanelComponent {
  constructor(
    private router: Router,
    private location: Location,
    private stateManagerService: StateManagerService,
  ) {}

  get currentState(): Observable<string | null> {
    return this.stateManagerService.currentState;
  }

  goBack() {
    this.location.back();
  }
}
