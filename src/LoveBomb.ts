import { Vec2, Cooldown } from './util';
import GameElement from './GameElement';
import Game from './Game';
import Map from './Map';
import * as Hearts from './Hearts';

export default class LoveBomb extends GameElement {

	private radius:number = 0;
	private emoji: string = Hearts.echo;
	private growCooldown: Cooldown = new Cooldown(6);

	constructor(position: Vec2, private power: number) {
		super(position);
	}

	private getBounds() {
		let minx = Math.max(this.position.x - this.radius, 0);
		let maxx = Math.min(this.position.x + this.radius, Map.WIDTH - 1);
		let miny = Math.max(this.position.y - this.radius, 0);
		let maxy = Math.min(this.position.y + this.radius, Map.HEIGHT - 1);
		return {
			minx,
			maxx,
			miny,
			maxy
		};
	}

	update(game: Game) {
		let bounds = this.getBounds();
		for (let i = bounds.minx; i <= bounds.maxx; i++) {
			for (let j = bounds.miny; j <= bounds.maxy; j++) {
				game.loveBombHit(new Vec2(i, j));
			}
		}

		this.growCooldown.update();
		if(this.growCooldown.isLive()){
			this.growCooldown.fire();
			this.radius++;
			if (this.radius > this.power) {
				game.removeElement(this);
			}
		}
	}

	draw(map: Map) {
		let bounds = this.getBounds();
		for (let i = bounds.minx; i <= bounds.maxx; i++) {
			for (let j = bounds.miny; j <= bounds.maxy; j++) {
				map.writeEmoji(this.emoji, new Vec2(i, j));
			}
		}
	}
}
