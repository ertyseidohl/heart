import Enemy from './Enemy';
import Game from './Game';
import Map from './Map';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

const SPREAD = 3;
const MIN_SPREAD = 1;

export default class MultiEnemy extends Enemy {
	protected emoji: string = Hearts.multiple;
	protected moveCooldown: Cooldown = new Cooldown(40);

	public preDeath(game: Game) {
		game.soundEngine.play("Multisplit");

		let up = this.position.clone();
		up.y += (Math.random() * SPREAD) + MIN_SPREAD;
		if (up.y > Map.HEIGHT - 1) up.y = Map.HEIGHT - 1;

		let down = this.position.clone();
		down.y -= (Math.random() * SPREAD) + MIN_SPREAD;
		if (down.y < 0) down.y = 0;

		let left = this.position.clone();
		left.x -= (Math.random() * SPREAD) + MIN_SPREAD;
		if (left.x < 0) left.x = 0;

		let right = this.position.clone();
		right.x += (Math.random() * SPREAD) + MIN_SPREAD;
		if (right.x > Map.WIDTH - 1) right.x = Map.WIDTH - 1;

		game.addElement(new Enemy(left));
		game.addElement(new Enemy(up));
		game.addElement(new Enemy(down));
		game.addElement(new Enemy(right));
	}
}
