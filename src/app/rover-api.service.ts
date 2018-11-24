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
}
