export class Vec2 {
	constructor(public x: number, public y: number) {}

	clone() {
		return new Vec2(this.x, this.y);
	}

	equals (v: Vec2) {
		return Math.floor(this.x) == Math.floor(v.x)
			&& Math.floor(this.y) == Math.floor(v.y);
	}
}

export class Cooldown {
	private counter: number = 0;
	constructor(public max: number) {}

	fire() {
		this.counter = this.max;
	}

	update() {
		if( this.counter > 0) {
			this.counter--;
		}
	}

	isLive() {
		return this.counter == 0;
	}
}
