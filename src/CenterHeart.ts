import GameElement from './GameElement';
import { Vec2, Cooldown, HeartShape } from './util';
import Game from './Game';
import Map from './Map';
import * as Hearts from './Hearts';
import Player from './Player';

export default class CenterHeart extends GameElement{

	public static HEALTH_FACTOR = 3;

	private heartShape: HeartShape;
	private beatCooldown: Cooldown;
	private isLarge = false;

	public health = Map.WIDTH;

	constructor(position: Vec2) {
		super(position);
		this.heartShape = new HeartShape(new Vec2(position.x, position.y), 3);
	}

	update (game: Game) {

	}


	draw (map: Map) {
		if (this.health > 2 * CenterHeart.HEALTH_FACTOR) {
			map.writeEmojiHeart(Hearts.red, this.heartShape);
		} else {
			map.writeEmojiHeart(Hearts.broken, this.heartShape);
		}

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
