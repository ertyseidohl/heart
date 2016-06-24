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

export class HeartShape{
	private static OFFSET = 2;
	private static SIZE = 5;

	constructor(
		private anchor: Vec2,
		private size: number
	) {}

	public contains(pos: Vec2): boolean {
		if (
			pos.x < this.anchor.x - HeartShape.OFFSET ||
			pos.y < this.anchor.y - HeartShape.OFFSET ||
			pos.x > this.anchor.x + HeartShape.OFFSET + 1 ||
			pos.y > this.anchor.y + HeartShape.OFFSET + 1
		) {
			return false;
		}

		let hitMask = this.getHitMask();

		let hitX = Math.floor(pos.x - this.anchor.x + HeartShape.OFFSET);
		let hitY = Math.floor(pos.y - this.anchor.y + HeartShape.OFFSET);

		return !!hitMask[(hitY * HeartShape.SIZE) + hitX];
	}

	private getHitMask() {
		switch(this.size) {
			case 1:
				return [
					0, 0, 0, 0, 0,
					0, 1, 0, 1, 0,
					0, 1, 1, 1, 0,
					0, 0, 1, 0, 0,
					0, 0, 0, 0, 0,
				];
			case 2:
				return [
					0, 0, 0, 0, 0,
					0, 1, 0, 1, 0,
					1, 1, 1, 1, 1,
					0, 1, 1, 1, 0,
					0, 0, 1, 0, 0,
				];
			case 3:
				return [
					0, 1, 0, 1, 0,
					1, 1, 1, 1, 1,
					1, 1, 1, 1, 1,
					0, 1, 1, 1, 0,
					0, 0, 1, 0, 0,
				];
		}
	}

	public getAll() : Vec2[] {
		let hitMask = this.getHitMask();
		let all: Vec2[] = [];
		for (var x = 0; x < HeartShape.SIZE; x++) {
			for (var y = 0; y < HeartShape.SIZE; y++) {
				if (hitMask[(y * HeartShape.SIZE) + x]) {
					all.push(new Vec2(
						x - HeartShape.OFFSET + this.anchor.x,
						y - HeartShape.OFFSET + this.anchor.y
					));
				}
			}
		}
		return all;
	}

	public clone() : HeartShape {
		return new HeartShape(
			this.anchor.clone(),
			this.size
		);
	}

	public getAnchor() : Vec2 {
		return this.anchor.clone();
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
			this.anchor.clone(),
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
