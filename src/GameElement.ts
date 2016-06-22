import Map from './Map';
import Game from './Game';
import { Vec2 } from './util';

abstract class GameElement {
	constructor(protected position: Vec2) {}

	public update (game: Game): void {};
	public draw (map: Map): void {};

	public next: GameElement = null;
	public prev: GameElement = null;

	public isAt(position: Vec2) {
		return this.position.equals(position);
	}
}

export default GameElement;
