import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionInputComponent } from './mission-input.component';

describe('MissionInputComponent', () => {
  let component: MissionInputComponent;
  let fixture: ComponentFixture<MissionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
