import { Vec2, Cooldown } from './util';
import Game from './Game';
import Enemy from './Enemy';
import Map from './Map';

export default class EnemyGenerator {
	private cooldown: Cooldown;

	constructor (timeout: number) {
		this.cooldown = new Cooldown(timeout);
	}

	update(game: Game) {
		this.cooldown.update();
		if(this.cooldown.isLive()) {
			this.cooldown.fire();

			let x;
			let y;

			if (Math.random() < 0.5) {
				x = Math.random() < 0.5 ? 0 : Map.WIDTH - 1;
				y = Math.floor(Math.random() * Map.HEIGHT);
			} else {
				x = Math.floor(Math.random() * Map.WIDTH);
				y = Math.random() < 0.5 ? 0 : Map.HEIGHT - 1;
			}

			game.addElement(
				new Enemy(
					new Vec2(x, y),
					new Vec2(
						Math.floor(Map.WIDTH / 2),
						Math.floor(Map.HEIGHT / 2)
					)
				)
			);
		}
	}
}
