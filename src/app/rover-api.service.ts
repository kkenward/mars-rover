import { Injectable } from '@angular/core';
import { Compass } from './compass.enum';

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

	X_MAX: number = 10;
	Y_MAX: number = 10;
	grid: boolean[][];

  constructor() { }

  init(config) {
  	this.x = config.x;
  	this.y = config.y;
  	this.heading = config.heading;
  	this.headingIndex = Compass[this.heading];
  	this.commands = config.commands;
    this.missionStatus = 'Initializing...';
  	this.initGrid();
  }

  initGrid() {
  	this.grid = new Array(this.X_MAX)
      .fill([])
      .map(() => new Array(this.Y_MAX).fill(false));

    // Add 1 to 5 obstacles randomly to the grid
    const obstacles = this.getRandomInt(1,5);
    for(let i = 1; i <= obstacles; i++) {
      let x = this.getRandomInt(0, this.X_MAX);
      let y = this.getRandomInt(0, this.Y_MAX);
      this.grid[x][y] = true;
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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
    const detected = this.detectObstacles(coords);

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

    if(x >= this.X_MAX) x = 0;
    if(x < 0) x = this.X_MAX - 1;
    if(y >= this.Y_MAX) y = 0;
    if(y < 0) y = this.Y_MAX - 1;

    return {x: x, y: y};
  }

  updateCoords(coords) {
    this.x = coords.x;
    this.y = coords.y;
    this.missionStatus = `Moved to coordinates (${this.x},${this.y}).`;
  }

  detectObstacles(coords) {
    return this.grid[coords.x][coords.y];
  }

  reportObstacles(coords) {
    this.missionStatus = `Obstacle Detected at (${coords.x},${coords.y})!`;
    console.log(this.missionStatus);
  }
}
