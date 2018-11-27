import { TestBed } from '@angular/core/testing';
import { RoverApiService } from './rover-api.service';
import { Grid } from './grid';
import { Rover } from './rover';

describe('RoverApiService', () => {
	let grid: Grid;
	let rover: Rover;
	let service: RoverApiService;
	let config;

  beforeEach(() => {
  	TestBed.configureTestingModule({});
  	grid = new Grid();
  	grid.init(0);
  	config = { x: 4, y: 3, heading: 'S', commands: ['f', 'l', 'f', 'r', 'b'] };
  	rover = new Rover();
  	rover.init(config);
  	service = TestBed.get(RoverApiService);
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializing api', () => {
    it('should be called with arguments', () => {
	  	spyOn(service, 'init').and.callThrough();

	  	service.init(rover, grid);

	  	expect(service.init).toHaveBeenCalledWith(jasmine.any(Rover), jasmine.any(Grid));
	  	expect(service.missionStatus).toBe('Initializing...');
	  });
  });

  describe('turning the rover', () => {
  	it('should turn right with command r', () => {
	  	service.init(rover, grid);

	  	expect(service.rover.getHeading()).toEqual('S');
	  	service.turn('r');
	  	expect(service.rover.getHeading()).toEqual('W');
	  	service.turn('r');
	  	expect(service.rover.getHeading()).toEqual('N');
	  	service.turn('r');
	  	expect(service.rover.getHeading()).toEqual('E');
	  	service.turn('r');
	  	expect(service.rover.getHeading()).toEqual('S');
  	});

  	it('should turn left with command l', () => {
	  	service.init(rover, grid);

	  	expect(service.rover.getHeading()).toEqual('S');
	  	service.turn('l');
	  	expect(service.rover.getHeading()).toEqual('E');
	  	service.turn('l');
	  	expect(service.rover.getHeading()).toEqual('N');
	  	service.turn('l');
	  	expect(service.rover.getHeading()).toEqual('W');
	  	service.turn('l');
	  	expect(service.rover.getHeading()).toEqual('S');
  	});
  });

  describe('moving the rover', () => {
  	describe('forward movement with command f', () => {
	  	it('should increase X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 0;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('f');
	  		const coords = service.rover.getCoords();

	  		expect(coords.x).toEqual(1);
	  	});

	  	it('should increase Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 0;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('f');
	  		const coords = service.rover.getCoords();

	  		expect(coords.y).toEqual(1);
	  	});

			it('should decrease X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 1;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('f');
	  		const coords = service.rover.getCoords();

	  		expect(coords.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 1;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('f');
	  		const coords = service.rover.getCoords();

	  		expect(coords.y).toEqual(0);
	  	});
		});

  	describe('backward movement for command b', () => {
	  	it('should increase X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 0;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('b');
	  		const coords = service.rover.getCoords();

	  		expect(coords.x).toEqual(1);
	  	});

	  	it('should increase Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 0;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('b');
	  		const coords = service.rover.getCoords();

	  		expect(coords.y).toEqual(1);
	  	});

			it('should decrease X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 1;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('b');
	  		const coords = service.rover.getCoords();

	  		expect(coords.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 1;
	  		rover.init(config);
	  		service.init(rover, grid);

	  		service.move('b');
	  		const coords = service.rover.getCoords();

	  		expect(coords.y).toEqual(0);
	  	});
		});

		describe('obstacles', () => {
			beforeEach(() => {
				config.x = 2;
  			config.y = 1;
  			config.heading = 'S';
  			spyOn(grid, 'detectObstacles').and.returnValue(true);
  			rover.init(config);
	  		service.init(rover, grid);
  		});

  		it('should detect obstacles', () => {
  			spyOn(rover, 'setCoords');
  			service.move('f');
	  		const coords = service.rover.getCoords();

  			expect(coords.x).toEqual(config.x);
  			expect(coords.y).toEqual(config.y);
  			expect(grid.detectObstacles).toHaveBeenCalled();
  			expect(rover.setCoords).not.toHaveBeenCalled();
  		});

  		it('should report obstacles', () => {
  			service.move('f');

  			expect(service.missionStatus).toEqual('Obstacle Detected at (2,2)!');
  		});
  	});
  });

  describe('parsing the commands array', () => {
  	beforeEach(() => {
  		spyOn(service, 'move').and.callThrough();
  		spyOn(service, 'turn').and.callThrough();
  	});

  	it('should relocate the rover after a series of commands', () => {
  		service.init(rover, grid);

  		service.parseCommands();
	  	const coords = service.rover.getCoords();

  		expect(coords.x).toBe(5);
  		expect(coords.y).toBe(3);
  		expect(service.rover.getHeading()).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(2);
  		expect(service.move).toHaveBeenCalledTimes(3);
  		expect(service.missionStatus).toEqual('Mission Complete!');
  	});

  	it('should stop parsing when obstacle detected', () => {
  		spyOn(grid, 'detectObstacles').and.returnValue(true);
  		service.init(rover, grid);

  		service.parseCommands();
	  	const coords = service.rover.getCoords();

  		expect(coords.x).toBe(4);
  		expect(coords.y).toBe(3);
  		expect(service.rover.getHeading()).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(0);
  		expect(service.move).toHaveBeenCalledTimes(1);
  		expect(service.missionStatus).toEqual('Obstacle Detected at (4,4)!');
  	});
  });
});
