import { TestBed } from '@angular/core/testing';
import { RoverApiService } from './rover-api.service';

describe('RoverApiService', () => {
	let service: RoverApiService;
	let config;

  beforeEach(() => {
  	TestBed.configureTestingModule({});
  	service = TestBed.get(RoverApiService);
  	config = { x: 4, y: 3, heading: 'S', commands: ['f', 'l', 'f', 'r', 'b'] };
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializing rover', () => {
    it('should be called with arguments', () => {
	  	spyOn(service, 'init');

	  	service.init(config);

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
	  	service.init(config);

	  	expect(service.x).toEqual(config.x);
	  	expect(service.y).toEqual(config.y);
	  	expect(service.heading).toEqual(config.heading);
	  });
  });

  describe('initializing the grid', () => {
  	it('should set up a grid');
  	it('should include obstacles');
  });

  describe('turning the rover', () => {
  	it('should turn right with command r', () => {
	  	service.init(config);

	  	expect(service.heading).toEqual('S');
	  	service.turn('r');
	  	expect(service.heading).toEqual('W');
	  	service.turn('r');
	  	expect(service.heading).toEqual('N');
	  	service.turn('r');
	  	expect(service.heading).toEqual('E');
	  	service.turn('r');
	  	expect(service.heading).toEqual('S');
  	});

  	it('should turn left with command l', () => {
	  	service.init(config);

	  	expect(service.heading).toEqual('S');
	  	service.turn('l');
	  	expect(service.heading).toEqual('E');
	  	service.turn('l');
	  	expect(service.heading).toEqual('N');
	  	service.turn('l');
	  	expect(service.heading).toEqual('W');
	  	service.turn('l');
	  	expect(service.heading).toEqual('S');
  	});
  });

  describe('moving the rover', () => {
  	it('should move forward with command f');
  	it('should move backward with command l');
  	it('should detect obstacles');
  	it('should report obstacles');
  	it('should wrap the grid');
  })
});
