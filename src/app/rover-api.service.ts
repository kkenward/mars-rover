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

  constructor() { }

  init(config) {
  	this.x = config.x;
  	this.y = config.y;
  	this.heading = config.heading;
  	this.headingIndex = Compass[this.heading];
  	this.commands = config.commands;
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
  	if(direction === 'f') {
  		if(this.heading === 'E') {
  			++this.x;
  		}
  		if(this.heading === 'S') {
  			++this.y;
  		}
  		if(this.heading === 'W') {
  			--this.x;
  		}
  		if(this.heading === 'N') {
  			--this.y;
  		}
  	}
  	if(direction === 'b') {
  		if(this.heading === 'W') {
  			++this.x;
  		}
  		if(this.heading === 'N') {
  			++this.y;
  		}
  		if(this.heading === 'E') {
  		  --this.x;
  		}
  		if(this.heading === 'S') {
  		  --this.y;
  		}
  	}
  }
}
