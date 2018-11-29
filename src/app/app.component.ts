import { Component } from '@angular/core';
import { Grid } from './grid';
import { Rover } from './rover';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mars-rover';
  grid = new Grid();
  rover = new Rover();
  config = {x: 2, y: 2, heading: 'W', commands: ['r']};

  launch() {
  	console.log('clicked launch mission button');
  }
}
