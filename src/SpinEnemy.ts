import Enemy from './Enemy';
import Game from './Game';
import Map from './Map';
import { Vec2 } from './util';
import * as Hearts from './Hearts';

export default class SpinEnemy extends Enemy {
	protected emoji: string = Hearts.wifi;
	private edgesSpun: number = 0;

	constructor() {
		super(Enemy.getStartingCoords());
		this.target = this.generateNextTarget()
	}

	private generateNextTarget(): Vec2 {
		if (this.edgesSpun > 2) {
			return new Vec2(
				Math.floor(Map.WIDTH / 2),
				Math.floor(Map.HEIGHT / 2)
			);
		}
		this.edgesSpun += 1;

		let y = Math.floor(this.position.y);
		let x = Math.floor(this.position.x);

		if (y === 0 && x !== Map.WIDTH - 1) {
			return new Vec2(Map.WIDTH - 1, 0)
		} else if (x === 0 && y !== Map.HEIGHT - 1) {
			return new Vec2(0, 0);
		} else if (y === Map.HEIGHT - 1) {
			return new Vec2(0, Map.HEIGHT - 1);
		} else if (x === Map.WIDTH - 1) {
			return new Vec2(Map.WIDTH - 1, Map.HEIGHT - 1);
		} else {
			//special values to spot errors
			return new Vec2(10, 4);
		}
	}

	public draw(map: Map) {
		map.writeEmoji(this.emoji, this.position);
	}

	protected updatePos(newPos: Vec2) {
		var angle = Math.atan2(
			this.target.y - this.position.y,
			this.target.x - this.position.x
		);
		newPos.x += Math.cos(angle);
		newPos.y += Math.sin(angle);

		if(this.target.equals(this.position)) {
			this.target = this.generateNextTarget();
		}

		if (newPos.x < 0) newPos.x = 0;
		else if (newPos.x > Map.WIDTH - 1) newPos.x = Map.WIDTH - 1;
		if (newPos.y < 0) newPos.y = 0;
		else if (newPos.y > Map.HEIGHT - 1) newPos.y = Map.HEIGHT - 1;
	}

}
