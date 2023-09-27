import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DeckSelectionComponent } from './screens/deck-selection/deck-selection.component';
import { StartScreenComponent } from './screens/start-screen/start-screen.component';
import { RoomSettingsComponent } from './screens/room-settings/room-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualElementsModule } from './visual-elements/visual-elements.module';

const appRoutes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'deckselection', component: DeckSelectionComponent },
  { path: 'newgame', component: RoomSettingsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    DeckSelectionComponent,
    RoomSettingsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    VisualElementsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
