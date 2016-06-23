import GameElement from './GameElement';
import {Vec2, Cooldown} from './util';
import * as Hearts from './Hearts';
import Game from './Game';
import Map from './Map';

const enemyEmoji: string[] = [
	Hearts.with_arrow,
	Hearts.green,
	Hearts.yellow
];

export default class Enemy extends GameElement {
	private emoji: string;
	private moveCooldown: Cooldown = new Cooldown(10);

	constructor(position: Vec2, private target: Vec2) {
		super(position);

		this.emoji = enemyEmoji[Math.floor(Math.random() * enemyEmoji.length)];
	}

	update(game: Game) {
		let newPos: Vec2 = this.position.clone();

		this.moveCooldown.update();
		if (this.moveCooldown.isLive()) {
			this.moveCooldown.fire();
			var angle = Math.atan2(
				this.target.y - this.position.y,
				this.target.x - this.position.x
			);
			newPos.x += Math.cos(angle);
			newPos.y += Math.sin(angle);
		}

		if (game.centerHeart.getRect().contains(newPos)) {
			game.centerHeart.collide(newPos);
			game.removeElement(this);
		}

		if (game.isLegalMove(this, newPos)) {
			this.position = newPos;
		}

	}

	draw(map: Map) {
		map.writeEmoji(this.emoji, this.position);
	}
}
