import { Injectable } from '@angular/core';
import { Compass } from './compass.enum';
import { Grid } from './grid';
import { Rover } from './rover';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoverApiService {
  private rover = new Rover();
  private grid = new Grid();

  rover$: ReplaySubject<Object>;

  constructor(){
    // TODO read config from file or input?
    const config = {x: 2, y: 2, heading: 'E', commands: ['f', 'r', 'f', 'r', 'f', 'l', 'l', 'f', 'r', 'b', 'b']};
    this.rover.init(config);
    this.grid.init();
    this.rover.setStatus('Initializing...');

    // TODO there must be another way to throttle the data stream
    this.rover$ = new ReplaySubject(config.commands.length + 1, null);
  }

  getRover() {
    return this.rover;
  }

  getGrid() {
    return this.grid;
  }

  updateRover() {
    const roverObj = {x: this.rover.getCoords().x, y: this.rover.getCoords().y, heading: this.rover.getHeading(), status: this.rover.getStatus()};
    this.rover$.next(roverObj);
  }

  parseCommands() {
    const commands = this.rover.getCommands();
    for(let command of commands) {
      if(command === 'r' || command === 'l') this.turn(command);
      if(command === 'f' || command === 'b') this.move(command);
      if(this.rover.getStatus().startsWith('Obstacle Detected')) break;
    }
    if(!this.rover.getStatus().startsWith('Obstacle Detected')) {
      this.rover.setStatus('Mission Complete!');
      this.updateRover();
    }
  }

  turn(direction: String) {
    let heading = this.rover.getHeading();
    let headingIndex = Compass[heading];

  	if(direction === 'r') {
  		headingIndex = (headingIndex + 1) % 4;
  	} else if(direction === 'l') {
  		headingIndex = (headingIndex + 4 - 1) % 4;
  	}

    heading = Compass[headingIndex];
    this.rover.setHeading(heading);
    this.rover.setStatus(`Turned to face ${heading}.`);
    this.updateRover();
  }

  move(direction: String) {
    const coords = this.getNewCoords(direction);
    const detected = this.grid.detectObstacles(coords);

    if(detected) {
      this.reportObstacles(coords);
    } else {
      this.updateCoords(coords);
    }
  }

  private getNewCoords(direction: String) {
    const coords = this.rover.getCoords();
    const heading = this.rover.getHeading();
    let x = coords.x;
    let y = coords.y;

    switch(heading) {
      case 'N': {
        y = direction === 'f' ? y - 1 : y + 1;
        break;
      }
      case 'S': {
        y = direction === 'f' ? y + 1 : y - 1;
        break;
      }
      case 'E': {
        x = direction === 'f' ? x + 1 : x - 1;
        break;
      }
      case 'W': {
        x = direction === 'f' ? x - 1 : x + 1;
        break;
      }
    }

    return this.grid.wrapCoords({x: x, y: y});
  }

  private updateCoords(coords) {
    this.rover.setCoords(coords);
    this.rover.setStatus(`Moved to coordinates (${coords.x},${coords.y}).`);
    this.updateRover();
  }

  private reportObstacles(coords) {
    const status = `Obstacle Detected at (${coords.x},${coords.y})!`
    this.rover.setStatus(status);
    this.updateRover();
    console.warn(status);
  }
}
