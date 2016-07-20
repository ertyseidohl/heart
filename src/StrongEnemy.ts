import Enemy from './Enemy';
import Game from './Game';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

export default class StrongEnemy extends Enemy {
	protected emoji: string = Hearts.with_bow;

	public preDeath(game: Game) {
		game.soundEngine.play("Ded");
		game.addElement(new Enemy(this.position.clone()));
	}
}
