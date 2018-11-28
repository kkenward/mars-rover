export class Grid {

	private X_MAX: number = 10;
	private Y_MAX: number = 10;
	private grid: boolean[][];

	init(numObstacles?:number) {
		this.fillGrid();
		this.addRandomObstacles(numObstacles);
	}

	getX_MAX() {
  	return this.X_MAX;
  }

  getY_MAX() {
  	return this.Y_MAX;
  }

  getGrid() {
  	return this.grid;
  }

	wrapCoords(coords) {
  	if(coords.x >= this.X_MAX) coords.x = 0;
    if(coords.x < 0) coords.x = this.X_MAX - 1;
    if(coords.y >= this.Y_MAX) coords.y = 0;
    if(coords.y < 0) coords.y = this.Y_MAX - 1;

    return coords;
  }

  detectObstacles(coords) {
  	return this.grid[coords.x][coords.y];
  }

  private fillGrid() {
  	this.grid = new Array(this.X_MAX)
      .fill([])
      .map(() => new Array(this.Y_MAX)
      	.fill(false));
  }

  private addRandomObstacles(numObstacles?:number) {
    if(numObstacles === undefined) numObstacles = this.getRandomInt(0, 5);
    for(let i = 1; i <= numObstacles; i++) {
      let x = this.getRandomInt(0, this.X_MAX);
      let y = this.getRandomInt(0, this.Y_MAX);
      this.grid[x][y] = true;
    }
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
