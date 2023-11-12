import { Component, Input } from '@angular/core';

enum Colors {
  Blue = 'blue',
  Red = 'red',
  Pink = 'pink',
  Green = 'green',
  Yellow = 'yellow',
}

enum InfoCircleTypes {
  None = 'none',
  ReadyState = 'ready-state',
  Score = 'score',
}

@Component({
  selector: 'user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss'],
})
export class UserIconComponent {
  @Input() avatarUrl: string = '';
  @Input() infoCircleType: InfoCircleTypes | string =
    InfoCircleTypes.ReadyState;
  @Input() showOverlayIcon: boolean = false;
  @Input() playerScore: number = 0;
  @Input() playerColor: Colors | string = Colors.Blue;
  @Input() playerReady: boolean = false;

  constructor() {}

  getStatusIcon(ready: boolean): string {
    return ready ? 'ready-icon' : 'waiting-icon';
  }

  getOverlayIcon() {
    return 'https://img.icons8.com/material-rounded/96/hourglass-sand-bottom.png';
  }
}
