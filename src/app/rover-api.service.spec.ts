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
  	it('should set up a grid', () => {
  		service.init(config);

  		expect(service.grid).toBeDefined();
  	});

  	it('should include obstacles', () => {
  		service.init(config);

  		let obstacles = service.grid.filter((x) => x.some((y) => y));
  		expect(obstacles.length>0).toBe(true);
  	});
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
  	describe('forward movement with command f', () => {
	  	it('should increase X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 0;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('f');

	  		expect(service.x).toEqual(1);
	  	});

	  	it('should increase Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 0;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('f');

	  		expect(service.y).toEqual(1);
	  	});

			it('should decrease X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 1;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('f');

	  		expect(service.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 1;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('f');

	  		expect(service.y).toEqual(0);
	  	});
		});

  	describe('backward movement for command b', () => {
	  	it('should increase X if heading W', () => {
	  		config.heading = 'W';
	  		config.x = 0;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('b');

	  		expect(service.x).toEqual(1);
	  	});

	  	it('should increase Y if heading N', () => {
	  		config.heading = 'N';
	  		config.y = 0;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('b');

	  		expect(service.y).toEqual(1);
	  	});

			it('should decrease X if heading E', () => {
	  		config.heading = 'E';
	  		config.x = 1;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('b');

	  		expect(service.x).toEqual(0);
	  	});

	  	it('should decrease Y if heading S', () => {
	  		config.heading = 'S';
	  		config.y = 1;
	  		service.init(config);
	  		removeObstacles();

	  		service.move('b');

	  		expect(service.y).toEqual(0);
	  	});
		});

		describe('wrapping the grid', () => {
			it('should wrap to 0 if x > max', () => {
				config.x = 9;
				config.heading = 'E';
				service.init(config);
	  		removeObstacles();

				service.move('f');

				expect(service.x).toEqual(0);
			});

			it('should wrap to max if x < 0', () => {
				config.x = 0;
				config.heading = 'W';
				service.init(config);
	  		removeObstacles();

				service.move('f');

				expect(service.x).toEqual(service.X_MAX - 1);
			});

			it('should wrap to 0 if y > max', () => {
				config.y = 9;
				config.heading = 'S';
				service.init(config);
	  		removeObstacles();

				service.move('f');

				expect(service.y).toEqual(0);
			});

			it('should wrap to max if y < 0', () => {
				config.y = 0;
				config.heading = 'N';
				service.init(config);
	  		removeObstacles();

				service.move('f');

				expect(service.y).toEqual(service.Y_MAX - 1);
			});
		});

		describe('obstacles', () => {
			beforeEach(() => {
				config.x = 2;
  			config.y = 1;
  			config.heading = 'S';
  			service.init(config);
  			service.grid[2][2] = true;
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
  		service.init(config);
  		removeObstacles();

  		service.parseCommands();

  		expect(service.x).toBe(5);
  		expect(service.y).toBe(3);
  		expect(service.heading).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(2);
  		expect(service.move).toHaveBeenCalledTimes(3);
  		expect(service.missionStatus).toEqual('Mission Complete!');
  	});

  	it('should stop parsing when obstacle detected', () => {
  		service.init(config);
  		service.grid[4][4] = true;

  		service.parseCommands();

  		expect(service.x).toBe(4);
  		expect(service.y).toBe(3);
  		expect(service.heading).toBe('S');
  		expect(service.turn).toHaveBeenCalledTimes(0);
  		expect(service.move).toHaveBeenCalledTimes(1);
  		expect(service.missionStatus).toEqual('Obstacle Detected at (4,4)!');
  	});
  });

	function removeObstacles() {
		// since obstacles are added randomly during init some tests need the grid to be reset
		service.grid = new Array(service.X_MAX)
	      .fill([])
	      .map(() => new Array(service.Y_MAX).fill(false));
	}
});
