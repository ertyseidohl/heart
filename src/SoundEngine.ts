///<reference path="howler.d.ts" />
export default class SoundEngine {
	private sounds: Object = {};
	private music: Howl;
	private musicPlaying: boolean = false;
	constructor() {
		let soundsToLoad = [
			"Ded",
			"Fire",
			"Heartbroken",
			"Hit",
			"NewLevel",
			"Spawn",
			"YouWin",
			"Multisplit",
			"Hearthit"
		];
		for (var i = 0; i < soundsToLoad.length; i++) {
			this.sounds[soundsToLoad[i]] = new Howl({
				src: "sounds/" + soundsToLoad[i] + ".wav"
			});
		}

		this.music = new Howl({
			src: "sounds/TickTock.wav",
			loop: true
		});
	}

	public play(sound:string) {
		console.log(sound);
		return this.sounds[sound].play();
	}

	public startMusic() {
		if (!this.musicPlaying) {
			this.musicPlaying = true;
			this.music.play();
		}
	}

	public stopMusic() {
		if (this.musicPlaying) {
			this.musicPlaying = false;
			this.music.stop();
		}
	}
}
