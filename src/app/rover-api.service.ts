import { Injectable } from '@angular/core';
import { Compass } from './compass.enum';
import { Grid } from './grid';
import { Rover } from './rover';

@Injectable({
  providedIn: 'root'
})
export class RoverApiService {
  private missionStatus: string;
  private rover = new Rover();
  private grid = new Grid();

  constructor(){
    // TODO read config from file or input?
    const config = {x: 2, y: 2, heading: 'E', commands: ['f', 'r', 'f', 'r', 'f', 'l', 'l', 'f', 'r', 'b', 'b','l']};
    this.rover.init(config);
    this.grid.init(20); // TODO remove hardcoded 
    this.missionStatus = 'Initializing...';
  }

  getMissionStatus() {
    return this.missionStatus;
  }

  getGrid() {
    return this.grid;
  }

  getRover() {
    return this.rover;
  }

  parseCommands() {
    // TODO maybe add a wait to see rover update?
    const commands = this.rover.getCommands();
    for(let command of commands) {
      if(command === 'r' || command === 'l') this.turn(command);
      if(command === 'f' || command === 'b') this.move(command);
      if(this.missionStatus.startsWith('Obstacle Detected')) break;
    }
    if(!this.missionStatus.startsWith('Obstacle Detected')) this.missionStatus = 'Mission Complete!';
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
    this.missionStatus = `Turned to face ${heading}.`;
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
    this.missionStatus = `Moved to coordinates (${coords.x},${coords.y}).`;
  }

  private reportObstacles(coords) {
    this.missionStatus = `Obstacle Detected at (${coords.x},${coords.y})!`;
    console.warn(this.missionStatus);
  }
}
