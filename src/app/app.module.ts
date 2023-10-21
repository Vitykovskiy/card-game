import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DeckSelectionComponent } from './screens/deck-selection/deck-selection.component';
import { StartScreenComponent } from './screens/start-screen/start-screen.component';
import { RoomSettingsComponent } from './screens/room-settings/room-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualElementsModule } from './visual-elements/visual-elements.module';
import { HttpClientModule } from '@angular/common/http';
import { JoinGameComponent } from './screens/join-game/join-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WaitingRoomComponent } from './screens/waiting-room/waiting-room.component';
import { GameRoomComponent } from './screens/game-room/game-room.component';
import { CardComponent } from './ui-components/card/card.component';

const appRoutes: Routes = [
  { path: '', component: StartScreenComponent },
  { path: 'deckselection', component: DeckSelectionComponent },
  { path: 'newgame', component: RoomSettingsComponent },
  { path: 'joingame', component: JoinGameComponent },
  { path: 'waiting', component: WaitingRoomComponent },
  { path: 'game', component: GameRoomComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    DeckSelectionComponent,
    RoomSettingsComponent,
    JoinGameComponent,
    WaitingRoomComponent,
    GameRoomComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    VisualElementsModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
