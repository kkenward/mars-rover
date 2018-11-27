import { Injectable } from '@angular/core';
import { Compass } from './compass.enum';
import { Grid } from './grid';

@Injectable({
  providedIn: 'root'
})
export class RoverApiService {
	x: number;
	y: number;
	heading: string;
	headingIndex: number;

	commands: string[];
  missionStatus: string;

  grid: Grid;

  constructor() { }

  init(config, grid) {
  	this.x = config.x;
  	this.y = config.y;
  	this.heading = config.heading;
  	this.headingIndex = Compass[this.heading];
  	this.commands = config.commands;
    this.missionStatus = 'Initializing...';
    this.grid = grid;
  }

  parseCommands() {
    for(let command of this.commands) {
      if(command === 'r' || command === 'l') this.turn(command);
      if(command === 'f' || command === 'b') this.move(command);
      if(this.missionStatus.startsWith('Obstacle Detected')) break;
    }
    if(!this.missionStatus.startsWith('Obstacle Detected')) this.missionStatus = 'Mission Complete!';
  }

  turn(direction: String) {
  	if(direction === 'r') {
  		this.headingIndex = (this.headingIndex + 1) % 4;
  	} else if(direction === 'l') {
  		this.headingIndex = (this.headingIndex + 4 - 1) % 4;
  	}
  	this.heading = Compass[this.headingIndex];
    this.missionStatus = `Turned to face ${this.heading}.`;
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

  getNewCoords(direction: String) {
    let x = this.x;
    let y = this.y;

    switch(this.heading) {
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

  updateCoords(coords) {
    this.x = coords.x;
    this.y = coords.y;
    this.missionStatus = `Moved to coordinates (${this.x},${this.y}).`;
  }

  reportObstacles(coords) {
    this.missionStatus = `Obstacle Detected at (${coords.x},${coords.y})!`;
    console.warn(this.missionStatus);
  }
}
