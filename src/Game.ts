import Map from './Map';
import Player from './Player';
import { Vec2, Rect, Cooldown } from './util';
import GameElement from './GameElement';
import EnemyGenerator from './EnemyGenerator';
import Enemy from './Enemy';
import CenterHeart from './CenterHeart';
import * as Hearts from './Hearts';
import {KeysObject, KeyboardListener} from './KeyboardListener';

const DEBUG = true;
const debugOut = document.getElementById("debug");

enum STATES {
	START,
	INSTRUCTIONS,
	SHOW_KEYS,
	SHOW_FIRE,
	DEAD,
	LIVE,
	WIPE
};

export default class Game {
	//all
	private map: Map;
	private state;
	private elementsListRoot: GameElement;

	//start
	private startCooldown: Cooldown;

	//wipe
	private wipeExistingMap: string[];
	private wipeLine: number;
	private wipeCooldown: Cooldown;
	private nextWipeState;
	private keys: KeysObject = KeyboardListener.getInstance().keys;

	//live
	public player: Player;
	private enemyGenerator: EnemyGenerator;
	public centerHeart: CenterHeart;

	constructor() {
		//set up map
		this.map = new Map(document.getElementById('out'));
		this.elementsListRoot = this.map;
		//set state
		this.setState(STATES.START);
		//start game loop
		this.loop();
	}

	private startLevel() {
		//set up center heart
		this.centerHeart = new CenterHeart(
			new Vec2(
				Math.floor(Map.WIDTH / 2),
				Math.floor(Map.HEIGHT / 2)
			)
		);
		this.addElement(this.centerHeart);

		//set up player (AFTER center heart!)
		this.player = new Player(new Vec2(2, 2));
		this.addElement(this.player);

		//set up enemy generator
		this.enemyGenerator = new EnemyGenerator(60);
	}

	private setState(newState) {
		switch (newState){
			case STATES.START:
			case STATES.INSTRUCTIONS:
			case STATES.SHOW_KEYS:
			case STATES.SHOW_FIRE:
			case STATES.DEAD:
				if (newState == STATES.DEAD) {
					this.map.setBackgroundEmoji(Hearts.broken);
					this.startCooldown = new Cooldown(240, true);
				} else {
					this.map.setBackgroundEmoji(Hearts.yellow);
					this.startCooldown = new Cooldown(120, true);
				}
				this.startCooldown.update();
				break;
			case STATES.LIVE:
				this.map.setBackgroundEmoji(Hearts.purple);
				this.startLevel();
				break;
			case STATES.WIPE:
				this.map.setClear(false);
				this.drawAllElements();
				this.wipeExistingMap = this.map.getBuffer();
				this.wipeLine = 0;
				this.wipeCooldown = new Cooldown(2);
				break;
		}
		this.state = newState;
	}

	private loop(): void {
		this.map.clearBuffer();
		window.requestAnimationFrame(this.loop.bind(this));
		if (DEBUG) {
			debugOut.innerHTML = this.state;
		}
		switch (this.state) {
			case STATES.START:
				this.nextWipeState = STATES.INSTRUCTIONS;
				this.stateStartLoop();
				break;
			case STATES.INSTRUCTIONS:
				this.nextWipeState = STATES.SHOW_KEYS;
				this.stateInstructionsLoop();
				break;
			case STATES.SHOW_KEYS:
				this.nextWipeState = STATES.SHOW_FIRE;
				this.stateShowKeysLoop();
				break;
			case STATES.SHOW_FIRE:
				this.nextWipeState = STATES.LIVE;
				this.stateShowFireLoop();
				break;
			case STATES.LIVE:
				this.stateLiveLoop();
				break;
			case STATES.WIPE:
				this.wipeLoop();
				break;
			case STATES.DEAD:
				this.stateDeadLoop();
				this.nextWipeState = STATES.LIVE;
				break;
		}

		this.updateAllElements();
		this.drawAllElements();
	}

	private updateAllElements() {
		let currentElement: GameElement = this.elementsListRoot;
		while (currentElement) {
			currentElement.update(this);
			currentElement = currentElement.next;
		}
	}

	private drawAllElements() {
		let currentElement = this.elementsListRoot;
		while (currentElement) {
			currentElement.draw(this.map);
			currentElement = currentElement.next;
		}
	}

	private stateStartLoop() {
		this.map.writeString(0, "LOVE", Hearts.purple);
		this.map.writeString(1, "B_MB", Hearts.purple);
		this.startCooldown.update();
		if (this.keys.space || this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private stateInstructionsLoop() {
		this.map.writeString(0, "DEF", Hearts.purple);
		this.map.writeString(1, "END_", Hearts.purple);
		this.startCooldown.update();
		if (this.keys.space || this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private stateShowKeysLoop() {
		this.map.writeString(0, "AROW", Hearts.purple);
		this.map.writeString(1, "KEYS", Hearts.purple);
		this.startCooldown.update();
		if (this.keys.space ||  this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private stateShowFireLoop() {
		this.map.writeString(0, "SPAC", Hearts.purple);
		this.map.writeString(1, "EBAR", Hearts.purple);
		this.startCooldown.update();
		if (this.keys.space || this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private stateDeadLoop() {
		this.map.writeString(0, " _", Hearts.yellow);
		this.map.writeString(1, "BRKN", Hearts.yellow);
		this.startCooldown.update();
		if (this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private stateLiveLoop() {
		this.enemyGenerator.update(this);

		if (this.centerHeart.health <= 0) {
			this.nextWipeState = STATES.DEAD;
			this.setState(STATES.WIPE);
			//clear live state after grabbing map buffer
			this.clearLiveState();
		}
	}

	private wipeLoop() {
		this.wipeCooldown.update();
		if (this.wipeCooldown.isLive()) {
			this.wipeCooldown.fire();

			let wipeEmoji = this.nextWipeState == STATES.DEAD ? Hearts.broken : Hearts.purple;

			for (let i = 0; i < Map.HEIGHT; i++) {
				this.wipeExistingMap[(i * Map.WIDTH) + this.wipeLine] = wipeEmoji;
			}

			this.wipeLine++;
		}

		this.map.setFullBuffer(this.wipeExistingMap);

		if (this.wipeLine == Map.WIDTH) {
			this.wipeCooldown = null;
			this.map.setClear(true);
			this.setState(this.nextWipeState);
		}
	}

	private clearLiveState() {
		this.player = null;
		this.enemyGenerator = null;
		this.centerHeart = null;
		let currentElement: GameElement = this.elementsListRoot;
		while (currentElement) {
			if (!(currentElement instanceof Map)) {
				currentElement = this.removeElement(currentElement);
			} else {
				currentElement = currentElement.next;
			}
		}
		this.elementsListRoot = this.map;
	}

	public addElement(element: GameElement): void {
		this.elementsListRoot.prev = element;
		element.next = this.elementsListRoot;
		this.elementsListRoot = element;
	}

	public removeElement(element: GameElement): GameElement {
		if (element.prev == null) {
			//start of list
			this.elementsListRoot = element.next;
		} else {
			element.prev.next = element.next;
		}

		if (element.next !== null) {
			element.next.prev = element.prev;
		}

		return element.next;
	}

	public loveBombHit(position: Vec2) {
		let currentElement = this.elementsListRoot;
		while (currentElement) {
			if (currentElement instanceof Enemy &&
				currentElement.isAt(position)
			) {
				currentElement = this.removeElement(currentElement);
			} else {
				currentElement = currentElement.next;
			}
		}
	}

	public isCollisionAt(pos: Vec2) {
		return false;
	}

	public isLegalMove(el: GameElement, newPos: Vec2) {
		let currentElement = this.elementsListRoot;
		while (currentElement) {
			if (el !== currentElement
				&& currentElement.isCollidableAt(newPos)
			) {
				return false;
			}
			currentElement = currentElement.next;
		}
		return true;
	}
}
