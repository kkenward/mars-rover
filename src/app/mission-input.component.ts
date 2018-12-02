import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mission-input',
  templateUrl: './mission-input.component.html',
  styleUrls: ['./mission-input.component.css']
})
export class MissionInputComponent implements OnInit {
	@Output() nextMission: EventEmitter<string> = new EventEmitter<string>();

	mission = 'none';

  constructor() { }

  ngOnInit() {
  }

  addMission(newMission: string) {
    if (newMission) {
      this.mission = newMission;
      this.nextMission.emit(this.mission);
    }
  }
}
