import GameElement from './GameElement';
import { Vec2, Cooldown, Rect } from './util';
import Game from './Game';
import Map from './Map';
import * as Hearts from './Hearts';
import Player from './Player';

export default class CenterHeart extends GameElement{

	public static HEALTH_FACTOR = 10;

	private rect;
	private beatCooldown: Cooldown;
	private inOut = false;

	public health = Map.WIDTH;

	constructor(position: Vec2) {
		super(position);
		this.beatCooldown = new Cooldown(60);
		this.rect = new Rect(
			new Vec2(position.x - 2, position.y - 2),
			4,
			4
		);
	}

	update (game: Game) {
		this.beatCooldown.update();
		if(this.beatCooldown.isLive()) {
			this.beatCooldown.fire();
			if (this.inOut) {
				this.rect.inflate(1);
			} else {
				this.rect.inflate(-1);
			}
			this.inOut = !this.inOut;
		}
	}


	draw (map: Map) {
		if (this.health > 2 * CenterHeart.HEALTH_FACTOR) {
			map.writeEmojiRect(Hearts.red, this.rect);
		} else {
			map.writeEmojiRect(Hearts.broken, this.rect);
		}
	}

	public getAll () : Vec2[] {
		return this.rect.getAll();
	}

	public getRect() : Rect {
		return this.rect.clone();
	}

	public collide(pos: Vec2) {
		this.health -= CenterHeart.HEALTH_FACTOR;
	}

	public isCollidableAt(pos: Vec2) {
		return this.rect.contains(pos);
	}

}
