import { Component, OnChanges, Input } from '@angular/core';
import { Grid } from './grid';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnChanges {
	@Input('grid') grid: Grid;
  @Input('status') status: string;

	private innerGrid: any[][];

  ngOnChanges(changes) {
    if(changes.status) {
      this.status = changes.status.currentValue;
    }
    if(changes.grid && changes.grid.firstChange) {
      this.innerGrid = changes.grid.currentValue.getInnerGrid();
    }
  }
}
