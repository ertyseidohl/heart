import GameElement from './GameElement';
import { Vec2, Cooldown, HeartShape } from './util';
import Game from './Game';
import Map from './Map';
import * as Hearts from './Hearts';
import Player from './Player';

export default class CenterHeart extends GameElement{

	public static HEALTH_FACTOR = 2;

	private heartShape: HeartShape;
	private beatCooldown: Cooldown;
	private isLarge = false;

	public static MAX_HEALTH = 16;
	public health = CenterHeart.MAX_HEALTH;

	constructor(position: Vec2, health?: number) {
		super(position);
		this.health = health || CenterHeart.MAX_HEALTH;
		this.heartShape = new HeartShape(new Vec2(position.x, position.y), 3);
	}

	update (game: Game) {

	}

	private getDamageOrder() {
		//in reverse (16 is first)
		return [
			0,  2,  0,  1,  0,
			3,  13, 15, 14, 4,
			5,  11, 16, 12, 6,
			0,  10, 8,  9,  0,
			0,  0,  7,  0,  0,
		];
	}


	draw (map: Map) {
		map.writeEmojiShape(Hearts.red, this.getAll());
		map.writeEmojiShape(Hearts.broken, this.getAllDamaged());


		if (Game.DEBUG) {
			for (let i = 0; i < Map.WIDTH; i++) {
				for (let j = 0; j < Map.HEIGHT; j++) {
					let d = new Vec2(i, j);
					if (this.isCollidableAt(d)) {
						map.writeEmoji(Hearts.in_pink_box, d);
					}
				}
			}
		}
	}

	public getAll () : Vec2[] {
		return this.heartShape.getAll();
	}

	public getAllDamaged() : Vec2[] {
		let all: Vec2[] = this.getAll();
		let allDamaged: Vec2[] = [];
		let damageMask: number[] = this.getDamageOrder();
		for (let pos of all){
			let x: number = pos.x - this.position.x + HeartShape.OFFSET;
			let y: number = pos.y - this.position.y + HeartShape.OFFSET;
			let dmg: number = damageMask[(y * HeartShape.SIZE) + x];
			if (dmg && dmg > this.health) {
				allDamaged.push(pos);
			}
		}
		return allDamaged;
	}

	public getAllUndamaged() : Vec2[] {
		return [];
	}

	public getheartShape() : HeartShape {
		return this.heartShape.clone();
	}

	public collide(pos: Vec2) {
		this.health -= CenterHeart.HEALTH_FACTOR;
	}

	public isCollidableAt(pos: Vec2) {
		return this.heartShape.contains(pos);
	}

	public getAnchor(): Vec2 {
		return this.heartShape.getAnchor();
	}

}
