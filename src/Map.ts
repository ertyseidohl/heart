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

	private useImages: boolean = false;
	private imageElementArr: HTMLImageElement[] = [];

	private backgroundEmoji: string = Hearts.none;

	private buffer: string[] = [];

	private shouldClear: boolean = true;

	constructor(private element: HTMLElement) {
		super(new Vec2(0, 0));
		for (var i = 0; i < Map.WIDTH * (Map.HEIGHT); i++) {
			this.buffer.push('');
		}
		this.clearBuffer();
		this.switchImagesRendering(this.useImages);
		this.draw(this);
	}

	public setBackgroundEmoji(emoji: string) {
		this.backgroundEmoji = emoji;
	}

	public setFullBuffer(buffer: string[]) {
		this.buffer = buffer;
	}

	public update(game: Game): void {
		if (this.useImages != game.useImages) {
			this.switchImagesRendering(game.useImages);
			this.useImages = game.useImages;
		}
	}

	private switchImagesRendering(useImages) {
		this.element.innerHTML = "";
		if (useImages) {
			for (let y = 0; y < Map.HEIGHT; y++ ){
				let row = document.createElement("div");
				row.className = "emoji_row";
				for (let x = 0; x < Map.WIDTH; x++) {
					let img = document.createElement("img");
					img.className = "emoji_img";
					this.imageElementArr.push(img);
					row.appendChild(img);
				}
				this.element.appendChild(row);
			}
		} else {
			this.imageElementArr = [];
		}
	}

	public draw(map: Map): void {
		if (!this.useImages) {
			this.element.innerHTML = this.buffer.join("");
		} else {
			for (let y = 0; y < Map.HEIGHT; y++) {
				for (let x = 0; x < Map.WIDTH; x ++) {
					this.updateImageAt(new Vec2(x, y));
				}
			}
		}
	}

	private getEmojiAt(pos: Vec2): string {
		return this.buffer[
			(Math.floor(pos.y) * Map.WIDTH) + Math.floor(pos.x)
		];
	}

	private getImageAt(pos: Vec2): HTMLImageElement {
		return this.imageElementArr[
			(Math.floor(pos.y) * Map.WIDTH) + Math.floor(pos.x)
		]
	}

	private updateImageAt(pos: Vec2) {
		let img: HTMLImageElement = this.getImageAt(pos);
		let emoji: string = this.getEmojiAt(pos);
		if (emoji !== img.getAttribute('data-emoji')) {
			img.src = this.getImageFor(emoji);
			img.setAttribute('data-emoji', emoji);
		}
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

	private getImageFor(emoji: string) {
		let url = "";
		switch (emoji){
			case Hearts.kissing:
				url = Hearts.i_kissing
				break;
			case Hearts.person:
				url = Hearts.i_person
				break;
			case Hearts.wifi:
				url = Hearts.i_wifi
				break;
			case Hearts.broken:
				url = Hearts.i_broken
				break;
			case Hearts.with_small:
				url = Hearts.i_with_small
				break;
			case Hearts.sparkles:
				url = Hearts.i_sparkles
				break;
			case Hearts.echo:
				url = Hearts.i_echo
				break;
			case Hearts.with_arrow:
				url = Hearts.i_with_arrow
				break;
			case Hearts.blue:
				url = Hearts.i_blue
				break;
			case Hearts.green:
				url = Hearts.i_green
				break;
			case Hearts.yellow:
				url = Hearts.i_yellow
				break;
			case Hearts.purple:
				url = Hearts.i_purple
				break;
			case Hearts.with_bow:
				url = Hearts.i_with_bow
				break;
			case Hearts.multiple:
				url = Hearts.i_multiple
				break;
			case Hearts.in_pink_box:
				url = Hearts.i_in_pink_box
				break;
			case Hearts.red:
				url = Hearts.i_red
				break;
			case Hearts.dead:
				url = Hearts.i_dead
				break;
			case Hearts.none:
				url = Hearts.i_none
				break;
		}
		return "./images/emoji_" + url + ".png"
	}
}
