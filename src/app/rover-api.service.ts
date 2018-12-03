import { Injectable } from '@angular/core';
import { Compass } from './compass.enum';
import { Grid } from './grid';
import { Rover } from './rover';

@Injectable({
  providedIn: 'root'
})
export class RoverApiService {
  private rover = new Rover();
  private grid = new Grid();

  private changeList = [];
  private nextIndex = -1;
  private missionComplete = false;

  constructor(){
    const config = {
      x: 0,
      y: 0,
      heading: 'E',
      commands: ['f', 'r', 'b', 'l'],
      status: 'Initializing...'
    };
    this.initRover(config);
    this.grid.init();
  }

  initRover(config) {
    this.missionComplete = false;
    this.changeList = [];
    this.nextIndex = -1;
    this.rover.init(config);
    this.updateRover();
  }

  getRover() {
    return this.rover;
  }

  getGrid() {
    return this.grid;
  }

  getNext() {
    if( this.missionComplete && this.nextIndex + 1 <= this.changeList.length ) {
      ++this.nextIndex;
      return this.changeList[this.nextIndex];
    }
    return {};
  }

  updateRover() {
    const roverObj = {
      x: this.rover.getCoords().x,
      y: this.rover.getCoords().y,
      heading: this.rover.getHeading(),
      status: this.rover.getStatus()
    };

    this.changeList.push(roverObj);
    if( roverObj.status.match(/Mission Complete!|Obstacle Detected/) ) {
      this.missionComplete = true;
    }
  }

  parseCommands() {
    const commands = this.rover.getCommands();
    for( let command of commands ) {
      if( command === 'r' || command === 'l' ) this.turn(command);
      if( command === 'f' || command === 'b' ) this.move(command);
      if( this.rover.getStatus().match(/Obstacle Detected/) ) break;
    }
    if( !this.rover.getStatus().match(/Obstacle Detected/) ) {
      this.rover.setStatus('Mission Complete!');
      this.updateRover();
    }
  }

  turn(direction: String) {
    let heading = this.rover.getHeading();
    let headingIndex = Compass[heading];

  	if( direction === 'r' ) {
  		headingIndex = (headingIndex + 1) % 4;
  	} else if( direction === 'l' ) {
  		headingIndex = (headingIndex + 4 - 1) % 4;
  	}

    heading = Compass[headingIndex];
    this.rover.setHeading(heading);
    this.rover.setStatus(`Turned '${direction}' to face ${heading}.`);
    this.updateRover();
  }

  move(direction: String) {
    const coords = this.getNewCoords(direction);
    const detected = this.grid.detectObstacles(coords);

    if( detected ) {
      this.reportObstacles(coords);
    } else {
      this.updateCoords(coords, direction);
    }
  }

  private getNewCoords(direction: String) {
    const coords = this.rover.getCoords();
    const heading = this.rover.getHeading();
    let x = coords.x;
    let y = coords.y;

    switch( heading ) {
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

    return this.grid.wrapCoords( {x: x, y: y} );
  }

  private updateCoords(coords, direction) {
    this.rover.setCoords(coords);
    this.rover.setStatus(`Moved '${direction}' to coordinates (${coords.x}, ${coords.y}).`);
    this.updateRover();
  }

  private reportObstacles(coords) {
    const status = `Obstacle Detected at (${coords.x}, ${coords.y})!`
    this.rover.setStatus(status);
    this.updateRover();
    console.warn(status);
  }
}
