import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NumericInputComponent } from '../ui-components/numeric-input/numeric-input.component';
import { UserIconComponent } from '../ui-components/user-icon/user-icon.component';
import { ToolPanelComponent } from '../ui-components/tool-panel/tool-panel.component';

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
