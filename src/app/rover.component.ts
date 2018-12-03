import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.css']
})
export class RoverComponent implements OnChanges {
	@Input('x') x: number;
	@Input('y') y: number;
	@Input('heading') headingClass: string;

	private top: number = 70;
	private left: number = 150;

	private TOP_OFFSET = 190;
	private LEFT_OFFSET = 57;

  ngOnChanges(changes) {
  	if(changes.x) {
  		this.x = changes.x.currentValue;
  	}
  	if(changes.y) {
  		this.y = changes.y.currentValue;
  	}
  	if(changes.headingClass) {
  		this.headingClass = changes.headingClass.currentValue;
  	}
  	this.updatePosition();
  }

  private updatePosition() {
  	const position = this.calculatePosition(this.x, this.y);
    this.top = position.top;
	  this.left = position.left;
  }

  private calculatePosition(x, y) {
  	const top = (y * 50) + this.TOP_OFFSET;
  	const left = (x * 50) + this.LEFT_OFFSET;
  	return { top: top, left: left };
  }
}
