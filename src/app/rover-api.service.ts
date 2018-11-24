import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoverApiService {
	x: number;
	y: number;
	heading: string;
	commands: string[];

  constructor() { }

  init(config) {
  	this.x = config.x;
  	this.y = config.y;
  	this.heading = config.heading;
  	this.commands = config.commands;
  }
}
