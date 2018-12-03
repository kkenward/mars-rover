import { Component } from '@angular/core';
import { RoverApiService } from './rover-api.service';
import { Rover } from './rover';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private apiService: RoverApiService;

  title = 'Mars Rover Challenge';

  innerGrid: any[][];
  status: string = '';
  x: number = 0;
  y: number = 0;
  heading: string = 'E';

	constructor(_apiService: RoverApiService) {
		this.apiService = _apiService;
    this.innerGrid = this.apiService.getGrid().getInnerGrid();

    const rover = this.apiService.getRover();
    this.status = rover.getStatus();
    this.heading = rover.getHeading();
    this.x = rover.getCoords().x;
    this.y = rover.getCoords().y;
	}

  launch() {
    setTimeout(() => { this.status = 'Launching in 5...4...3...2...1...'; }, 0);
    let poller = setInterval(() => {
      let value = this.apiService.getNext();
      if( value ) this.setValues(value);
      if( value.status.match(/Mission Complete!|Obstacle Detected/) ) clearInterval(poller);
    }, 3000);

    this.apiService.parseCommands();
  }

  updateMission(event) {
    event.status = 'New mission received.';
    this.apiService.initRover(event);
    this.setValues(event);
  }

  private setValues(values) {
    const copy = Object.assign({}, values);

    setTimeout(() => {
      this.status = copy.status;
      this.x = copy.x;
      this.y = copy.y;
      this.heading = copy.heading;
    }, 0);
  }
}
