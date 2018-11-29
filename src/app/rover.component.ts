import { Component, OnInit, OnChanges, AfterViewInit, Input } from '@angular/core';
import { Rover } from './rover';

@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.css']
})
export class RoverComponent implements OnInit, OnChanges, AfterViewInit {
	@Input('rover') rover: Rover;
	@Input('config') config: Object;
	@Input('getPosition') getPosition: Function;

	headingClass: string = 'E';
	top: number = 70;
	left: number = 150;

  constructor() { }

  ngOnInit() {
  	this.rover.init(this.config);
  }

  ngOnChanges(changes) {
  	if(changes.rover.firstChange) console.log('2 - rover onchanges firstChange');
  	if(changes.rover && !changes.rover.firstChange) {
			console.log('rover onchanges not firstChange');
  		this.updatePosition();
  	}
  }

  ngAfterViewInit() {
  	console.log('5 - rover afterviewinit');
  }

  updatePosition() {
  	const cell = this.rover.getCoords();
  	const position = this.getPosition(cell);
  	this.top = position.top;
	  this.left = position.left;
	  this.headingClass = this.rover.getHeading();
  }
}
