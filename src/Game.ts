///<reference path="howler.d.ts" />
import Map from './Map';
import Player from './Player';
import { Vec2, Rect, Cooldown } from './util';
import GameElement from './GameElement';
import Enemy from './Enemy';
import FastEnemy from './FastEnemy';
import GoldEnemy from './GoldEnemy';
import MultiEnemy from './MultiEnemy';
import SpinEnemy from './SpinEnemy';
import StrongEnemy from './StrongEnemy';
import CenterHeart from './CenterHeart';
import * as Hearts from './Hearts';
import {KeysObject, KeyboardListener} from './KeyboardListener';
import { E, LEVELS } from './Levels';
import SoundEngine from './SoundEngine';

const debugOut = document.getElementById("debug");

enum STATES {
	START,
	INSTRUCTIONS,
	SHOW_KEYS,
	SHOW_FIRE,
	FIRST_SHOW_LEVEL,
	SHOW_LEVEL,
	DEAD,
	LIVE,
	WIPE,
	WIN
};

export default class Game {
	public static DEBUG = false;

	//all
	private map: Map;
	private state;
	private elementsListRoot: GameElement;
	public soundEngine: SoundEngine;

	//start
	private startCooldown: Cooldown;

	//wipe
	private wipeExistingMap: string[];
	private wipeLine: number;
	private wipeCooldown: Cooldown;
	private nextWipeState;
	private keys: KeysObject = KeyboardListener.getInstance().keys;

	//live
	private level: number = 0;
	private levelEnemyIndex = 0;
	public player: Player;
	public centerHeart: CenterHeart;
	private enemyGenCooldown: Cooldown;
	private centerHeartHealthCarry = CenterHeart.MAX_HEALTH;

	constructor() {
		//set up audio
		this.soundEngine = new SoundEngine();
		//set up map
		this.map = new Map(document.getElementById('out'));
		this.elementsListRoot = this.map;
		//set state
		this.setState(STATES.START);
		// this.setState(STATES.LIVE);
		//start game loop
		this.loop();
	}

	private startLevel() {
		//set up center heart
		this.centerHeart = new CenterHeart(
			new Vec2(
				Math.floor(Map.WIDTH / 2),
				Math.floor(Map.HEIGHT / 2)
			),
			this.centerHeartHealthCarry
		);
		this.addElement(this.centerHeart);

		//set up player (AFTER center heart!)
		this.player = new Player(new Vec2(2, 2));
		this.addElement(this.player);

		//set up enemy generator
		this.enemyGenCooldown = new Cooldown(60);
	}

	private setState(newState) {
		switch (newState){
			case STATES.DEAD:
				this.soundEngine.stopMusic();
				this.level = 0;
				this.centerHeartHealthCarry = CenterHeart.MAX_HEALTH;
				this.nextWipeState = STATES.SHOW_LEVEL;
				this.map.setBackgroundEmoji(Hearts.broken);
				this.startCooldown = new Cooldown(240, true);
				this.startCooldown.update();
				break;
			case STATES.INSTRUCTIONS:
				this.soundEngine.startMusic();
				this.map.setBackgroundEmoji(Hearts.yellow);
				this.startCooldown = new Cooldown(180, true);
				this.startCooldown.update();
				break;
			case STATES.FIRST_SHOW_LEVEL:
				this.soundEngine.startMusic();
				this.soundEngine.play("NewLevel");
				this.map.setBackgroundEmoji(Hearts.yellow);
				this.startCooldown = new Cooldown(180, true);
				this.startCooldown.update();
				break;
			case STATES.START:
			case STATES.SHOW_KEYS:
			case STATES.SHOW_FIRE:
			case STATES.DEAD:
			case STATES.SHOW_LEVEL:
			case STATES.WIN:
				this.soundEngine.startMusic();
				this.map.setBackgroundEmoji(Hearts.yellow);
				this.startCooldown = new Cooldown(180, true);
				this.startCooldown.update();
				break;
			case STATES.LIVE:
				this.soundEngine.startMusic();
				this.map.setBackgroundEmoji(Hearts.purple);
				this.startLevel();
				break;
			case STATES.WIPE:
				this.soundEngine.startMusic();
				if (this.nextWipeState == STATES.SHOW_LEVEL) {
					this.soundEngine.play("NewLevel");
				}
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
		if (Game.DEBUG) {
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
				this.nextWipeState = STATES.FIRST_SHOW_LEVEL;
				this.stateShowFireLoop();
				break;
			case STATES.FIRST_SHOW_LEVEL:
			case STATES.SHOW_LEVEL:
				this.nextWipeState = STATES.LIVE;
				this.stateShowLevelLoop();
				break;
			case STATES.LIVE:
				this.stateLiveLoop();
				break;
			case STATES.WIPE:
				this.wipeLoop();
				break;
			case STATES.DEAD:
				this.stateDeadLoop();
				break;
			case STATES.WIN:
				this.nextWipeState = STATES.START;
				this.stateWinLoop();
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
		this.map.writeString(0, "!@#$", Hearts.purple);
		this.map.writeString(1, "%^&*", Hearts.purple);
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

	private stateShowLevelLoop() {
		this.map.writeString(0, "LVL", Hearts.purple);
		this.map.writeString(1, "" + (this.level + 1), Hearts.purple);
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
		if (this.centerHeart.health <= 0) {
			this.soundEngine.play("Heartbroken");
			this.nextWipeState = STATES.DEAD;
			this.setState(STATES.WIPE);
			//clear live state after grabbing map buffer
			this.clearLiveState();
		}

		this.enemyGenCooldown.update();
		if (this.enemyGenCooldown.isLive()) {
			this.enemyGenCooldown.fire();

			if (this.levelEnemyIndex < LEVELS[this.level].length) {
				this.addEnemy(LEVELS[this.level][this.levelEnemyIndex]);
				this.levelEnemyIndex++;
			} else if(this.allEnemiesDefeated()) {
				this.level++;
				this.centerHeartHealthCarry = this.centerHeart.health;
				this.levelEnemyIndex = 0;
				if (this.level < LEVELS.length) {
					this.nextWipeState = STATES.SHOW_LEVEL;
					this.setState(STATES.WIPE);
				} else {
					this.setState(STATES.WIN);
				}
				this.clearLiveState();
			}
		}
	}

	private stateWinLoop() {
		this.map.writeString(0, "YOU", Hearts.purple);
		this.map.writeString(1, "WIN_", Hearts.purple);
		this.startCooldown.update();
		if (this.keys.space || this.startCooldown.isLive()) {
			this.startCooldown = null;
			this.setState(STATES.WIPE);
		}
	}

	private allEnemiesDefeated() {
		let currentElement = this.elementsListRoot;
		while (currentElement) {
			if (currentElement instanceof Enemy) {
				return false;
			}
			currentElement = currentElement.next;
		}
		return true;
	}

	private addEnemy(enemyType) {
		if (enemyType !== E.NONE) {
			this.soundEngine.play("Spawn");
		}
		switch(enemyType) {
			case E.RED4:
				this.addElement(new Enemy());
				this.addElement(new Enemy());
				//fallthrough
			case E.RED2:
				this.addElement(new Enemy());
				//fallthrough
			case E.RED:
				this.addElement(new Enemy())
				break;
			case E.FAST:
				this.addElement(new FastEnemy());
				break;
			case E.GOLD10:
				for (let i = 0; i < 9; i++) {
					this.addElement(new GoldEnemy());
				}
				//fallthrough
			case E.GOLD:
				this.addElement(new GoldEnemy());
				break;
			case E.MULTI:
				this.addElement(new MultiEnemy());
				break;
			case E.NONE:
				//noop
				break;
			case E.SPIN4:
				this.addElement(new SpinEnemy());
				this.addElement(new SpinEnemy());
				this.addElement(new SpinEnemy());
				//fallthrough
			case E.SPIN:
				this.addElement(new SpinEnemy());
				break;
			case E.STRONG:
				this.addElement(new StrongEnemy());
				break;
			default:
				throw new Error("unkonwn enemy type: " + enemyType);
		}
	}

	private wipeLoop() {
		this.wipeCooldown.update();
		if (this.wipeCooldown.isLive()) {
			this.wipeCooldown.fire();

			let wipeEmoji;
			if (this.nextWipeState == STATES.DEAD) {
				wipeEmoji = Hearts.broken;
			} else if (this.nextWipeState == STATES.SHOW_LEVEL) {
				wipeEmoji = Hearts.yellow;
			} else {
				wipeEmoji = Hearts.purple;
			}

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
		this.centerHeart = null;
		this.levelEnemyIndex = 0;
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
			if (currentElement instanceof Enemy
				&& currentElement.isAt(position)
				&& (<Enemy>currentElement).canDie()
			) {
				(<Enemy>currentElement).preDeath(this);
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
