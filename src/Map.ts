import * as Hearts from './Hearts';
import GameElement from './GameElement';
import Game from './Game';
import { Vec2 } from './util';

export default class Map extends GameElement {
	public static WIDTH: number = 30;
	public static HEIGHT: number = 20;

	private buffer: string[] = [];

	constructor(private element: HTMLElement) {
		super(new Vec2(0,0));
		for (var i = 0; i < Map.WIDTH * Map.HEIGHT; i++) {
			this.buffer.push('');
		}
		this.clearBuffer();
		this.draw(this);
	}

	public update(game: Game): void {

	}

	public draw(map: Map): void {
		this.element.innerHTML = this.buffer.join("");
	}

	public writeEmoji(emoji: string, pos: Vec2) {
		if (pos.x > Map.WIDTH || pos.y > Map.HEIGHT) {
			throw new Error(pos.x + ", " + pos.y + " is outside bounds");
		}
		this.buffer[
			Math.floor(pos.y) * Map.WIDTH + Math.floor(pos.x)
		] = emoji;
	}

	public clearBuffer(): void {
		for (var i = 0; i < Map.WIDTH * Map.HEIGHT; i++) {
			this.buffer[i] = Hearts.purple;
		}
	}
}
