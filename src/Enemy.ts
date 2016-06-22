import GameElement from './GameElement';
import {Vec2, Cooldown} from './util';
import * as Hearts from './Hearts';
import Game from './Game';
import Map from './Map';

const enemyEmoji: string[] = [
	Hearts.with_arrow,
	Hearts.broken,
	Hearts.yellow
];

export default class Enemy extends GameElement {
	private emoji: string;
	private moveCooldown: Cooldown = new Cooldown(30);

	constructor(position: Vec2, private target: Vec2) {
		super(position);

		this.emoji = enemyEmoji[Math.floor(Math.random() * enemyEmoji.length)];
	}

	update(game: Game) {
		this.moveCooldown.update();
		if (this.moveCooldown.isLive()) {
			this.moveCooldown.fire();
			var angle = Math.atan2(
				this.target.y - this.position.y,
				this.target.x - this.position.x
			);
			this.position.x += Math.cos(angle);
			this.position.y += Math.sin(angle);
		}
	}

	draw (map: Map) {
		map.writeEmoji(this.emoji, this.position);
	}
}
