import { Rover } from './rover';

describe('Rover', () => {
	let rover;
	let config;
	beforeEach(() => {
		rover = new Rover();
		config = { x: 4, y: 3, heading: 'S', commands: ['f', 'l', 'f', 'r', 'b'] };
	});

  it('should create an instance', () => {
    expect(rover).toBeTruthy();
  });

	it('should initialize the rover position', () => {
  	rover.init(config);

  	expect(rover.x).toEqual(config.x);
  	expect(rover.y).toEqual(config.y);
  	expect(rover.heading).toEqual(config.heading);
  });

});
