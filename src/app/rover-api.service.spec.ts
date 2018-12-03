import { TestBed } from '@angular/core/testing';
import { RoverApiService } from './rover-api.service';
import { Grid } from './grid';
import { Rover } from './rover';

describe('RoverApiService', () => {
	let service: RoverApiService;
	let config;

  beforeEach(() => {
  	TestBed.configureTestingModule({});
  	service = TestBed.get(RoverApiService);

  	config = { x: 4, y: 3, heading: 'S', commands: ['f', 'l', 'f', 'r', 'b'] };
  	service.getRover().init(config);
  	service.getGrid().init(0);
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializing api', () => {
    it('should be called with arguments', () => {
	  	expect(service.getRover().getStatus()).toBe('Initializing...');
	  });
  });

  describe('turning the rover', () => {
  	it('should turn right with command r', () => {
	  	expect(service.getRover().getHeading()).toEqual('S');
	  	service.turn('r');
	  	expect(service.getRover().getHeading()).toEqual('W');
	  	service.turn('r');
	  	expect(service.getRover().getHeading()).toEqual('N');
	  	service.turn('r');
	  	expect(service.getRover().getHeading()).toEqual('E');
	  	service.turn('r');
	  	expect(service.getRover().getHeading()).toEqual('S');
  	});

  	it('should turn left with command l', () => {
	  	expect(service.getRover().getHeading()).toEqual('S');
	  	service.turn('l');
	  	expect(service.getRover().getHeading()).toEqual('E');
	  	service.turn('l');
	  	expect(service.getRover().getHeading()).toEqual('N');
	  	service.turn('l');
	  	expect(service.getRover().getHeading()).toEqual('W');
	  	service.turn('l');
	  	expect(service.getRover().getHeading()).toEqual('S');
  	});
  });

  describe('moving the rover', () => {
  	describe('forward movement with command f', () => {
	  	it('should increase X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 0;
	  		service.getRover().init(config);

	  		service.move('f');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.x).toEqual(1);
	  	});

	  	it('should increase Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 0;
	  		service.getRover().init(config);

	  		service.move('f');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.y).toEqual(1);
	  	});

			it('should decrease X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 1;
	  		service.getRover().init(config);

	  		service.move('f');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 1;
	  		service.getRover().init(config);

	  		service.move('f');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.y).toEqual(0);
	  	});
		});

  	describe('backward movement for command b', () => {
	  	it('should increase X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 0;
	  		service.getRover().init(config);

	  		service.move('b');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.x).toEqual(1);
	  	});

	  	it('should increase Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 0;
	  		service.getRover().init(config);

	  		service.move('b');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.y).toEqual(1);
	  	});

			it('should decrease X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 1;
	  		service.getRover().init(config);

	  		service.move('b');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 1;
	  		service.getRover().init(config);

	  		service.move('b');
	  		const coords = service.getRover().getCoords();

	  		expect(coords.y).toEqual(0);
	  	});
		});

		describe('obstacles', () => {
			let grid: Grid;
			beforeEach(() => {
				config.x = 2;
  			config.y = 1;
  			config.heading = 'S';
  			grid = service.getGrid();
  			spyOn(grid, 'detectObstacles').and.returnValue(true);
  			service.getRover().init(config);
  		});

  		it('should detect obstacles', () => {
  			let rover = service.getRover();
  			spyOn(rover, 'setCoords');
  			service.move('f');
	  		const coords = service.getRover().getCoords();

  			expect(coords.x).toEqual(config.x);
  			expect(coords.y).toEqual(config.y);
  			expect(grid.detectObstacles).toHaveBeenCalled();
  			expect(rover.setCoords).not.toHaveBeenCalled();
  		});

  		it('should report obstacles', () => {
  			service.move('f');

  			expect(service.getRover().getStatus()).toEqual('Obstacle Detected at (2, 2)!');
  		});
  	});
  });

  describe('parsing the commands array', () => {
  	beforeEach(() => {
  		spyOn(service, 'move').and.callThrough();
  		spyOn(service, 'turn').and.callThrough();
  	});

  	it('should relocate the rover after a series of commands', () => {
  		service.parseCommands();
	  	const coords = service.getRover().getCoords();

  		expect(coords.x).toBe(5);
  		expect(coords.y).toBe(3);
  		expect(service.getRover().getHeading()).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(2);
  		expect(service.move).toHaveBeenCalledTimes(3);
  		expect(service.getRover().getStatus()).toEqual('Mission Complete!');
  	});

  	it('should stop parsing when obstacle detected', () => {
  		let grid = service.getGrid();
  		spyOn(grid, 'detectObstacles').and.returnValue(true);

  		service.parseCommands();
	  	const coords = service.getRover().getCoords();

  		expect(coords.x).toBe(4);
  		expect(coords.y).toBe(3);
  		expect(service.getRover().getHeading()).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(0);
  		expect(service.move).toHaveBeenCalledTimes(1);
  		expect(service.getRover().getStatus()).toEqual('Obstacle Detected at (4, 4)!');
  	});
  });
});
