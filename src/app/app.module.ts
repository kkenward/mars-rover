import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid.component';
import { RoverComponent } from './rover.component';
import { MissionInputComponent } from './mission-input.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    RoverComponent,
    MissionInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
