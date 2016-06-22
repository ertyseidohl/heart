import Map from './Map';
import Game from './Game';
import GameElement from './GameElement';
import { Vec2, Cooldown } from './util';
import {KeysObject, KeyboardListener} from './KeyboardListener';
import * as Hearts from './Hearts';
import LoveBomb from './LoveBomb';

export default class Player extends GameElement {

	private keys: KeysObject = new KeyboardListener().keys;
	private emoji: string = Hearts.kissing;
	private power: number = 3;

	private moveTimer: Cooldown = new Cooldown(4);
	private loveTimer: Cooldown = new Cooldown(30);

	constructor(position: Vec2) {
		super(position);
	}

	update(game: Game) {
		//update timers
		this.moveTimer.update();
		this.loveTimer.update();

		//check movement
		if(this.moveTimer.isLive()) {
			this.moveTimer.fire();
			if (this.keys.down && this.position.y < Map.HEIGHT - 1) {
				this.position.y++;
			}
			if (this.keys.up && this.position.y > 0) {
				this.position.y--;
			}
			if (this.keys.left && this.position.x > 0) {
				this.position.x--;
			}
			if (this.keys.right && this.position.x < Map.WIDTH - 1) {
				this.position.x++;
			}
		}

		//check firing
		if(this.keys.space && this.loveTimer.isLive()){
			this.loveTimer.fire();
			game.addElement(new LoveBomb(this.position.clone(), this.power));
		}
	}

	draw (map: Map) {
		map.writeEmoji(this.emoji, this.position);
	}
}
