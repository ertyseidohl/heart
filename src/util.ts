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

export class Rect{
	private dirty = true;
	private allCache = [];

	constructor (
		private anchor: Vec2,
		private width: number,
		private height: number
	) {}

	contains (pos: Vec2) {
		return (
			pos.x >= this.anchor.x &&
			pos.x < this.anchor.x + this.width &&
			pos.y >= this.anchor.y &&
			pos.y < this.anchor.y + this.height
		);
	}

	inflate (amt: number) {
		this.anchor.x -= amt;
		this.anchor.y -= amt;
		this.width += amt * 2;
		this.height += amt * 2;
		this.dirty = true;
	}

	getAll() {
		if (this.dirty) {
			this.allCache = [];
			for (let x = this.anchor.x; x < this.anchor.x + this.width; x++) {
				for (let y = this.anchor.y; y < this.anchor.y + this.height; y++) {
					this.allCache.push(new Vec2(x, y));
				}
			}
		}
		return this.allCache;
	}

	getBounds() {
		return {
			anchor : this.anchor,
			width: this.width,
			height: this.height
		}
	}

	clone() {
		return new Rect(
			this.anchor,
			this.width,
			this.height
		);
	}

	isInside(rect: Rect) {
		let bounds = rect.getBounds();
		return (
			this.anchor.x >= bounds.anchor.x
			&& this.anchor.y >= bounds.anchor.y
			&& this.anchor.x + this.width < bounds.anchor.x + bounds.width
			&& this.anchor.y + this.height < bounds.anchor.y + bounds.height
		);
	}
}

export class Cooldown {
	private counter: number = 0;
	constructor(public max: number, deadAtStart?: boolean) {
		if (deadAtStart) {
			this.counter = max;
		}
	}

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
