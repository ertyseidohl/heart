import GameElement from './GameElement';
import {Vec2, Cooldown} from './util';
import * as Hearts from './Hearts';
import Game from './Game';
import Map from './Map';

export default class Enemy extends GameElement {
	protected emoji: string = Hearts.broken;
	protected moveCooldown: Cooldown = new Cooldown(30);
	protected startCooldown: Cooldown = new Cooldown(18, true);
	protected target: Vec2;

	constructor(position? : Vec2) {
		super(position || Enemy.getStartingCoords());
		this.target = new Vec2(
			Math.floor(Map.WIDTH / 2),
			Math.floor(Map.HEIGHT / 2)
		);
	}

	update(game: Game) {
		let newPos: Vec2 = this.position.clone();

		this.moveCooldown.update();
		this.startCooldown.update();

		if (this.moveCooldown.isLive()) {
			this.moveCooldown.fire();
			this.updatePos(newPos);
		}

		if (game.centerHeart.isCollidableAt(newPos)) {
			game.centerHeart.collide(newPos);
			game.removeElement(this);
		}

		if (game.isLegalMove(this, newPos)) {
			this.position = newPos;
		}

	}

	protected updatePos(newPos: Vec2) {
		var angle = Math.atan2(
			this.target.y - this.position.y,
			this.target.x - this.position.x
		);
		newPos.x += Math.cos(angle);
		newPos.y += Math.sin(angle);
	}

	public canDie(): boolean {
		return this.startCooldown.isLive();
	}

	public preDeath(game: Game) {

	}

	draw(map: Map) {
		map.writeEmoji(this.emoji, this.position);
	}

	public static getStartingCoords() : Vec2 {
		let x;
		let y;

		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 : Map.WIDTH - 1;
			y = Math.floor(Math.random() * Map.HEIGHT);
		} else {
			x = Math.floor(Math.random() * Map.WIDTH);
			y = Math.random() < 0.5 ? 0 : Map.HEIGHT - 1;
		}

		return new Vec2(x, y);


	}
}
