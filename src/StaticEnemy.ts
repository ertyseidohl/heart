import Enemy from './Enemy';
import { Vec2 } from './util';
import * as Hearts from './Hearts';
import Game from './Game';

export default class StaticEnemy extends Enemy {
	protected emoji: string = Hearts.sparkles;

	public update(game: Game) {

	}

	public canDie() {
		return true;
	}

}
