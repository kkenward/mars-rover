import { Component } from '@angular/core';
import { RoverApiService } from './rover-api.service';
import { Grid } from './grid';
import { Rover } from './rover';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private apiService: RoverApiService;

  private title = 'Mars Rover Challenge';

  innerGrid: any[][];
  status: string = '';
  x: number = 70;
  y: number = 150;
  heading: string = 'E';

	constructor(_apiService: RoverApiService) {
		this.apiService = _apiService;
    this.innerGrid = this.apiService.getGrid().getInnerGrid();

    const rover = this.apiService.getRover();
    this.status = rover.getStatus();
    this.heading = rover.getHeading();
    this.x = rover.getCoords().x;
    this.y = rover.getCoords().y;

    this.apiService.rover$.subscribe((rover$) => this.getValues(rover$));
	}

  updateMission(event) {
    console.log('new mission', event);
  }

  private getValues(rover$) {
    const copy = Object.assign({}, rover$);

    setTimeout(() => {
    this.status = copy.status;
    this.x = copy.x;
    this.y = copy.y;
    this.heading = copy.heading;
    }, 5000);
  }

  private launch() {
    this.apiService.parseCommands();
  }
}
