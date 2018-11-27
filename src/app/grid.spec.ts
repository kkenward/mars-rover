import { Grid } from './grid';

describe('Grid', () => {
	let testGrid: Grid;

	beforeEach(() => testGrid = new Grid());

  it('should create an instance', () => {
    expect(testGrid).toBeTruthy();
  });

	describe('initializing the grid', () => {
  	it('should set up a grid', () => {
  		const resultGrid = new Array(10)
      	.fill([])
      	.map(() => new Array(10)
      		.fill(false));

  		testGrid.init(0);
  		const grid = testGrid.getGrid();

  		expect(testGrid).toEqual(jasmine.any(Grid));
  		expect(grid).toEqual(resultGrid);
  		expect(grid.length).toEqual(testGrid.getX_MAX());
  		expect(grid[0].length).toEqual(testGrid.getY_MAX());
  	});

  	it('should include obstacles', () => {
  		testGrid.init(1);

  		const grid = testGrid.getGrid();
  		const obstacles = grid.filter((x) => x.some((y) => y));

  		expect(obstacles.length>0).toBe(true);
  	});
  });

	describe('wrapping the grid', () => {
		it('should wrap to 0 if x > max', () => {
			testGrid.init(0);

			const xmax = testGrid.getX_MAX();
			const newCoords = testGrid.wrapCoords({x: xmax + 1, y: 0});

			expect(newCoords).toEqual({x: 0, y: 0});
		});

		it('should wrap to max if x < 0', () => {
			testGrid.init(0);

			const xmax = testGrid.getX_MAX();
			const newCoords = testGrid.wrapCoords({x: -1, y: 0});

			expect(newCoords).toEqual({x: xmax - 1, y: 0});
		});

		it('should wrap to 0 if y > max', () => {
			testGrid.init(0);

			const ymax = testGrid.getY_MAX();
			const newCoords = testGrid.wrapCoords({x: 0, y: ymax + 1});

			expect(newCoords).toEqual({x: 0, y: 0});
		});

		it('should wrap to max if y < 0', () => {
			testGrid.init(0);

			const ymax = testGrid.getY_MAX();
			const newCoords = testGrid.wrapCoords({x: 0, y: -1});

			expect(newCoords).toEqual({x: 0, y: ymax - 1});
		});
	});

	describe('detecting obstacles', () => {
		it('should be able to detect obstacles at coords', () => {
			testGrid.init(1);
			const xmax = testGrid.getX_MAX();
			const ymax = testGrid.getY_MAX();
			const grid = testGrid.getGrid();

			let coords = {};
			for(let x = 0; x < xmax; x++) {
				for(let y = 0; y < ymax; y++) {
					if(grid[x][y]) coords = {x: x, y: y};
				}
			}

			expect(testGrid.detectObstacles(coords)).toBe(true);
		});
	});
});
