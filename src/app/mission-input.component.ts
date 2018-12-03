import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mission-input',
  templateUrl: './mission-input.component.html',
  styleUrls: ['./mission-input.component.css']
})
export class MissionInputComponent {
	@Output() nextMission: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  addMission(newMission: string) {
    if (newMission) {
      try {
        const parsed = JSON.parse(newMission);
        this.nextMission.emit(parsed);
      } catch {
        window.alert('JSON parse error!\nEnter a mission as a valid JSON object.\n( e.g. {"x":3,"y":4,"heading":"S","commands":["f","l","b",r"]} )');
      }
    }
  }
}
