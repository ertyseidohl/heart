

export class KeysObject {
	up: boolean = false;
	down: boolean = false;
	left: boolean = false;
	right: boolean = false;
	space: boolean = false;
}

export class KeyboardListener{
	public keys = new KeysObject();

	constructor() {
		document.addEventListener(
			'keydown',
			(e: KeyboardEvent) => {
				if (this.isKeystroke(e.keyCode)) {
					e.preventDefault();
					this.keychange(true, e.keyCode)
				}
			}
		);
		document.addEventListener(
			'keyup',
			(e: KeyboardEvent) => {
				if (this.isKeystroke(e.keyCode)) {
					e.preventDefault();
					this.keychange(false, e.keyCode)
				}
			}
		);
	}

	private isKeystroke(keyCode: number) : boolean {
		switch(keyCode) {
			case 38:
			case 87:
			case 40:
			case 83:
			case 37:
			case 65:
			case 39:
			case 68:
			case 32:
			case 67:
				return true;
		}
		return false;
	}

	public static getInstance() {
		if (!keyboardListener) {
			keyboardListener = new KeyboardListener();
		}
		return keyboardListener;
 	}

	private keychange (on: boolean, code: number) {
		switch(code) {
			case 38: //up
			case 87: //w
				this.keys.up = on;
				break;
			case 40: //down
			case 83: //s
				this.keys.down = on;
				break;
			case 37: //left
			case 65: //a
				this.keys.left = on;
				break;
			case 39: //right
			case 68: //d
				this.keys.right = on;
				break;
			case 32: //space
			case 67: //c
				this.keys.space = on;
				break;
		}
	}


}

let keyboardListener = new KeyboardListener();
