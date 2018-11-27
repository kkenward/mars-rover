export class Rover {
	private x: number;
	private y: number;
	private heading: string;
	private commands: string[];

	init(config: any) {
		this.x = config.x;
		this.y = config.y;
		this.heading = config.heading;
		this.commands = config.commands;
	}

	getCommands() {
		return this.commands;
	}

	getCoords() {
		return {x: this.x, y: this.y};
	}

	setCoords(coords) {
		this.x = coords.x;
		this.y = coords.y;
	}

	getHeading() {
		return this.heading;
	}

	setHeading(heading) {
		this.heading = heading;
	}
}
