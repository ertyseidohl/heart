import Map from './Map';
import Game from './Game';
import GameElement from './GameElement';
import { Vec2, Cooldown, Rect } from './util';
import {KeysObject, KeyboardListener} from './KeyboardListener';
import * as Hearts from './Hearts';
import LoveBomb from './LoveBomb';

export default class Player extends GameElement {

	private keys: KeysObject = KeyboardListener.getInstance().keys;
	private emoji: string = Hearts.kissing;
	private deadEmoji: string = Hearts.dead;
	private power: number = 2;

	private moveTimer: Cooldown = new Cooldown(4);
	private loveTimer: Cooldown = new Cooldown(20);

	constructor(position: Vec2) {
		super(position);
	}

	update(game: Game) {
		//update timers
		this.moveTimer.update();
		this.loveTimer.update();

		//check movement
		let newPos : Vec2 = this.position.clone();
		if(this.moveTimer.isLive()) {
			this.moveTimer.fire();
			if (this.keys.down && this.position.y < Map.HEIGHT - 1) {
				newPos.y++;
			}
			if (this.keys.up && this.position.y > 0) {
				newPos.y--;
			}
			if (this.keys.left && this.position.x > 0) {
				newPos.x--;
			}
			if (this.keys.right && this.position.x < Map.WIDTH - 1) {
				newPos.x++;
			}
		}
		if (game.isLegalMove(this, newPos)) {
			this.position = newPos;
		}

		//check if we are in the center heart
		let centerHeartCenter: Vec2 = game.centerHeart.getAnchor();
		while (game.centerHeart.isCollidableAt(this.position)) {
			let angle = Math.atan2(
				this.position.y - centerHeartCenter.y,
				this.position.x - centerHeartCenter.x
			);

			this.position.x += Math.cos(angle);
			this.position.y += Math.sin(angle);
		}

		//check firing
		if(this.keys.space && this.loveTimer.isLive()){
			this.loveTimer.fire();
			game.soundEngine.play("Fire");
			game.addElement(new LoveBomb(this.position.clone(), this.power));
		}
	}

	draw (map: Map) {
		if (this.loveTimer.isLive()) {
			map.writeEmoji(this.emoji, this.position);
		} else {
			map.writeEmoji(this.deadEmoji, this.position);
		}
	}
}
