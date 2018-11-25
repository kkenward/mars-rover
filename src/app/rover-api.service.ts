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
  	this.initGrid();
  }

  initGrid() {
  	this.grid = new Array(this.X_MAX)
      .fill([])
      .map(() => new Array(this.Y_MAX).fill(false));
  }

  turn(direction: String) {
  	if(direction === 'r') {
  		this.headingIndex = (this.headingIndex + 1) % 4;
  	} else if(direction === 'l') {
  		this.headingIndex = (this.headingIndex + 4 - 1) % 4;
  	}
  	this.heading = Compass[this.headingIndex];
  }

  move(direction: String) {
  	switch(this.heading) {
		  case 'N': {
		    this.y = direction === 'f' ? this.y - 1 : this.y + 1;
		    break;
		  }
		  case 'S': {
		    this.y = direction === 'f' ? this.y + 1 : this.y - 1;
		    break;
		  }
		  case 'E': {
		    this.x = direction === 'f' ? this.x + 1 : this.x - 1;
		    break;
		  }
		  case 'W': {
		    this.x = direction === 'f' ? this.x - 1 : this.x + 1;
		    break;
		  }
		}

    if(this.x >= this.X_MAX) this.x = 0;
    if(this.x < 0) this.x = this.X_MAX - 1;
    if(this.y >= this.Y_MAX) this.y = 0;
    if(this.y < 0) this.y = this.Y_MAX - 1;
  }
}
