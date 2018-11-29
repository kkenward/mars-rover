import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Grid } from './grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
	@Input('grid') grid: Grid;

	innerGrid: any[][];
	xmax = 0;
	ymax = 0;

  constructor() { }

  ngOnInit() { 
  	this.grid.init();
  	this.innerGrid = this.grid.getGrid();

  	this.xmax = this.grid.getX_MAX();
  	this.ymax = this.grid.getY_MAX();
    console.log('1 - grid init');
  }

  ngAfterViewInit() {
    console.log('4 - grid afterviewinit');
  }

  public getCellPosition(coords) {
    const cellClass = `.x${coords.x}y${coords.y}`;
    let rect = document.querySelector(cellClass).getBoundingClientRect();
    return {top: rect.top, left: rect.left};
  }
}
