import Enemy from './Enemy';
import Game from './Game';
import Map from './Map';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

const SPREAD = 3;

export default class FastEnemy extends Enemy {
	protected emoji: string = Hearts.multiple;

	public preDeath(game: Game) {
		let up = this.position.clone();
		up.y += Math.random() * SPREAD;
		if (up.y > Map.HEIGHT - 1) up.y = Map.HEIGHT - 1;

		let down = this.position.clone();
		down.y -= Math.random() * SPREAD;
		if (down.y < 0) down.y = 0;

		let left = this.position.clone();
		left.x -= Math.random() * SPREAD;
		if (left.x < 0) left.x = 0;

		let right = this.position.clone();
		right.x += Math.random() * SPREAD;
		if (right.x > Map.WIDTH - 1) right.x = Map.WIDTH - 1;

		game.addElement(new Enemy(left));
		game.addElement(new Enemy(up));
		game.addElement(new Enemy(down));
		game.addElement(new Enemy(right));
	}
}
