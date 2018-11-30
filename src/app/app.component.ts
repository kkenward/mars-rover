import { Component } from '@angular/core';
import { RoverApiService } from './rover-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private apiService: RoverApiService;

  private title = 'Mars Rover Challenge';

	constructor(_apiService: RoverApiService) {
		this.apiService = _apiService;
	}

  private launch() {
  	this.apiService.parseCommands();
  }
}
