import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NumericInputComponent } from '../widgets/numeric-input/numeric-input.component';
import { UserIconComponent } from '../widgets/user-icon/user-icon.component';
import { ToolPanelComponent } from '../widgets/tool-panel/tool-panel.component';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    NumericInputComponent,
    UserIconComponent,
    ToolPanelComponent,
  ],
  imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule],
  exports: [
    PrimaryButtonComponent,
    NumericInputComponent,
    UserIconComponent,
    ToolPanelComponent,
  ],
})
export class VisualElementsModule {}
