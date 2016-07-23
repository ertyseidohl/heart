import * as Hearts from './Hearts';
import GameElement from './GameElement';
import Game from './Game';
import { Vec2, Rect, HeartShape } from './util';
import CenterHeart from './CenterHeart';

import * as Letters from './Letters';

const LETTER_BUFFER = 2;
const LETTER_WIDTH = 7;
const LETTER_HEIGHT = 7;

export default class Map extends GameElement {
	public static WIDTH: number = 30;
	public static HEIGHT: number = 30;

	private backgroundEmoji: string = Hearts.none;

	private buffer: string[] = [];

	private shouldClear: boolean = true;

	constructor(private element: HTMLElement) {
		super(new Vec2(0, 0));
		for (var i = 0; i < Map.WIDTH * (Map.HEIGHT); i++) {
			this.buffer.push('');
		}
		this.clearBuffer();
		this.draw(this);
	}

	public setBackgroundEmoji(emoji: string) {
		this.backgroundEmoji = emoji;
	}

	public setFullBuffer(buffer: string[]) {
		this.buffer = buffer;
	}

	public update(game: Game): void {

	}

	public draw(map: Map): void {
		this.element.innerHTML = this.buffer.join("");
	}

	public setClear(shouldClear: boolean) {
		this.shouldClear = shouldClear;
	}

	public writeEmoji(emoji: string, pos: Vec2) {
		if (pos.x > Map.WIDTH || pos.y > Map.HEIGHT) {
			throw new Error("point " + pos.x + ", " + pos.y + " is outside bounds");
		}
		this.buffer[
			(Math.floor(pos.y) * Map.WIDTH) + Math.floor(pos.x)
		] = emoji;
	}

	public writeEmojiRect(emoji: string, rect: Rect) {
		if (!rect.isInside(this.getRect())) {
			throw new Error("rect" + rect.getBounds() + " is outside bounds");
		}
		let all: Vec2[] = rect.getAll();
		for (let p of all) {
			this.writeEmoji(emoji, p);
		}
	}

	public writeEmojiShape(emoji: string, all: Vec2[]) {
		for (let p of all) {
			this.writeEmoji(emoji, p);
		}
	}

	public getRect() {
		return new Rect(
			new Vec2(0, 0),
			Map.WIDTH,
			Map.HEIGHT
		);
	}

	public clearBuffer(): void {
		if (!this.shouldClear) {
			return;
		}
		for (var i = 0; i < Map.WIDTH * Map.HEIGHT; i++) {
			this.buffer[i] = this.backgroundEmoji;
		}
	}

	public writeString(line: number, str: string, emoji: string): void {
		let letters = str.split("");
		for (let i = 0; i < letters.length; i++) {
			this.writeLetter(
				Letters.getLetter(letters[i]),
				(LETTER_BUFFER - 1) + (LETTER_WIDTH * i),
				(LETTER_BUFFER * (line + 1)) + (line * LETTER_HEIGHT),
				emoji
			);
		}
	}

	public writeLetter(letterTemplate: number[], x: number, y: number, emoji: string) {
		for (let i = 0; i < LETTER_WIDTH; i ++) {
			for (let j = 0; j < LETTER_HEIGHT; j++ ){
				if (letterTemplate[j * LETTER_HEIGHT + i]) {
					this.writeEmoji(emoji, new Vec2(x + i, y + j));
				}
			}
		}
	}

	public getBuffer() {
		return this.buffer;
	}

	public isCollidableAt(pos: Vec2) {
		return false;
	}
}
