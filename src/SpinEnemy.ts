import Enemy from './Enemy';
import Game from './Game';
import Map from './Map';
import { Vec2 } from './util';
import * as Hearts from './Hearts';

export default class SpinEnemy extends Enemy {
	protected emoji: string = Hearts.wifi;

	constructor() {
		super(Enemy.getStartingCoords());
		this.target = SpinEnemy.generateRandomTarget()
	}

	private static generateRandomTarget() {
		return new Vec2(
			Math.random() * Map.WIDTH,
			Math.random() * Map.HEIGHT
		);
	}

	protected updatePos(newPos: Vec2) {
		var angle = Math.atan2(
			this.target.y - this.position.y,
			this.target.x - this.position.x
		);
		newPos.x += Math.cos(angle);
		newPos.y += Math.sin(angle);

		if(this.target.equals(this.position)) {
			this.target = SpinEnemy.generateRandomTarget();
		}

		if (newPos.x < 0) newPos.x = 0;
		else if (newPos.x > Map.WIDTH - 1) newPos.x = Map.WIDTH - 1;
		if (newPos.y < 0) newPos.y = 0;
		else if (newPos.y > Map.HEIGHT - 1) newPos.y = Map.HEIGHT - 1;
	}

}
