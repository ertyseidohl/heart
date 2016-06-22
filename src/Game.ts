import Map from './Map';
import Player from './Player';
import { Vec2 } from './util';
import GameElement from './GameElement';
import EnemyGenerator from './EnemyGenerator';
import Enemy from './Enemy';

export default class Game {
	private map: Map;
	private player: Player;
	private enemyGenerator: EnemyGenerator;

	private elementsListRoot: GameElement;

	constructor() {
		//set up map
		this.map = new Map(document.getElementById('out'));
		this.elementsListRoot = this.map;

		//set up player
		this.player = new Player(new Vec2(2,2));
		this.addElement(this.player);

		//set up enemy generator
		this.enemyGenerator = new EnemyGenerator(60);

		//start game loop
		this.loop();
	}

	private loop(): void {
		this.map.clearBuffer();
		window.requestAnimationFrame(this.loop.bind(this));

		this.enemyGenerator.update(this);

		//update
		let currentElement: GameElement = this.elementsListRoot;
		while (currentElement) {
			currentElement.update(this);
			currentElement = currentElement.next;
		}

		//draw
		currentElement = this.elementsListRoot;
		while (currentElement) {
			currentElement.draw(this.map);
			currentElement = currentElement.next;
		}
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
}
