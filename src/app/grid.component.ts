import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnChanges {
	@Input('grid') grid: any[][];
  @Input('status') status: string;

  ngOnChanges(changes) {
    if(changes.status) {
      this.status = changes.status.currentValue;
    }
    if(changes.grid && changes.grid.firstChange) {
      this.grid = changes.grid.currentValue;
    }
  }
}
