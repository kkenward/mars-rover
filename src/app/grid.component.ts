import { Component, OnInit, Input } from '@angular/core';
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
  }

}
