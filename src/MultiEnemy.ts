import Enemy from './Enemy';
import Game from './Game';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

export default class FastEnemy extends Enemy {
	protected emoji: string = Hearts.multiple;

	public preDeath(game: Game) {
		let up = this.position.clone();
		up.y--;
		let down = this.position.clone();
		down.y--;
		let left = this.position.clone();
		left.x--;
		let right = this.position.clone();
		right.x++;

		game.addElement(new Enemy(left));
		game.addElement(new Enemy(up));
		game.addElement(new Enemy(down));
		game.addElement(new Enemy(right));
	}
}
