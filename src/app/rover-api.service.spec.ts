import { TestBed } from '@angular/core/testing';

import { RoverApiService } from './rover-api.service';

describe('RoverApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoverApiService = TestBed.get(RoverApiService);
    expect(service).toBeTruthy();
  });

  describe('initializing rover', () => {
    it('should be called with arguments', () => {
	  	const service: RoverApiService = TestBed.get(RoverApiService);
	  	spyOn(service, 'init');

	  	service.init({x: 0, y: 0, heading: 'S', commands: ['r', 'f', 'l', 'b']});

	  	expect(service.init).toHaveBeenCalledWith(jasmine.objectContaining(
	  		{
	  			x: jasmine.any(Number),
	  		 	y: jasmine.any(Number),
	  		 	heading: jasmine.any(String),
	  		 	commands: jasmine.any(Array)
  		 	}
		 	));
	  });

  	it('should initialize the rover position', () => {
	  	const service: RoverApiService = TestBed.get(RoverApiService);

	  	service.init({x: 0, y: 0, heading: 'S', commands: ['r', 'f', 'l', 'b']});

	  	expect(service.x).toEqual(0);
	  	expect(service.y).toEqual(0);
	  	expect(service.heading).toEqual('S');
	  });
  });

  describe('initializing the grid', () => {
  	it('should set up a grid');
  	it('should include obstacles');
  });

  describe('turning the rover', () => {
  	it('should turn right with command r');
  	it('should turn left with command l');
  });

  describe('moving the rover', () => {
  	it('should move forward with command f');
  	it('should move backward with command l');
  	it('should detect obstacles');
  	it('should report obstacles');
  	it('should wrap the grid');
  })
});
