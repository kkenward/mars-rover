import { TestBed } from '@angular/core/testing';
import { RoverApiService } from './rover-api.service';
import { Grid } from './grid';

describe('RoverApiService', () => {
	let grid: Grid;
	let service: RoverApiService;
	let config;

  beforeEach(() => {
  	TestBed.configureTestingModule({});
  	grid = new Grid();
  	grid.init(0);
  	service = TestBed.get(RoverApiService);
  	config = { x: 4, y: 3, heading: 'S', commands: ['f', 'l', 'f', 'r', 'b'] };
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializing rover', () => {
    it('should be called with arguments', () => {
	  	spyOn(service, 'init');

	  	service.init(config, grid);

	  	expect(service.init).toHaveBeenCalledWith(jasmine.objectContaining(
	  		{
	  			x: jasmine.any(Number),
	  		 	y: jasmine.any(Number),
	  		 	heading: jasmine.any(String),
	  		 	commands: jasmine.any(Array)
  		 	}
		 	), jasmine.any(Grid));
	  });

  	it('should initialize the rover position', () => {
	  	service.init(config, grid);

	  	expect(service.x).toEqual(config.x);
	  	expect(service.y).toEqual(config.y);
	  	expect(service.heading).toEqual(config.heading);
	  });
  });

  describe('turning the rover', () => {
  	it('should turn right with command r', () => {
	  	service.init(config, grid);

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
	  	service.init(config, grid);

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
  	describe('forward movement with command f', () => {
	  	it('should increase X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 0;
	  		service.init(config, grid);

	  		service.move('f');

	  		expect(service.x).toEqual(1);
	  	});

	  	it('should increase Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 0;
	  		service.init(config, grid);

	  		service.move('f');

	  		expect(service.y).toEqual(1);
	  	});

			it('should decrease X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 1;
	  		service.init(config, grid);

	  		service.move('f');

	  		expect(service.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 1;
	  		service.init(config, grid);

	  		service.move('f');

	  		expect(service.y).toEqual(0);
	  	});
		});

  	describe('backward movement for command b', () => {
	  	it('should increase X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 0;
	  		service.init(config, grid);

	  		service.move('b');

	  		expect(service.x).toEqual(1);
	  	});

	  	it('should increase Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 0;
	  		service.init(config, grid);

	  		service.move('b');

	  		expect(service.y).toEqual(1);
	  	});

			it('should decrease X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 1;
	  		service.init(config, grid);

	  		service.move('b');

	  		expect(service.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 1;
	  		service.init(config, grid);

	  		service.move('b');

	  		expect(service.y).toEqual(0);
	  	});
		});

		describe('obstacles', () => {
			beforeEach(() => {
				config.x = 2;
  			config.y = 1;
  			config.heading = 'S';
  			spyOn(grid, 'detectObstacles').and.returnValue(true);
  			service.init(config, grid);
  		});

  		it('should detect obstacles', () => {
  			service.move('f');

  			expect(service.x).toEqual(config.x);
  			expect(service.y).toEqual(config.y);
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
  		service.init(config, grid);

  		service.parseCommands();

  		expect(service.x).toBe(5);
  		expect(service.y).toBe(3);
  		expect(service.heading).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(2);
  		expect(service.move).toHaveBeenCalledTimes(3);
  		expect(service.missionStatus).toEqual('Mission Complete!');
  	});

  	it('should stop parsing when obstacle detected', () => {
  		spyOn(grid, 'detectObstacles').and.returnValue(true);
  		service.init(config, grid);

  		service.parseCommands();

  		expect(service.x).toBe(4);
  		expect(service.y).toBe(3);
  		expect(service.heading).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(0);
  		expect(service.move).toHaveBeenCalledTimes(1);
  		expect(service.missionStatus).toEqual('Obstacle Detected at (4,4)!');
  	});
  });
});
