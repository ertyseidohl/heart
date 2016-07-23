///<reference path="howler.d.ts" />
export default class SoundEngine {
	private sounds: Object = {};
	private music: Howl;
	private musicPlaying: boolean = false;

	private muted: boolean = false;

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
			src: ["sounds/HeartBrokenButNotSquishy.webm", "sounds/HeartBrokenButNotSquishy.mp3"],
			loop: true
		});
	}

	public play(sound:string) {
		this.sounds[sound].play();
		this.sounds[sound].volume(this.muted ? 0 : 1);
	}

	public startMusic() {
		if (!this.musicPlaying) {
			this.musicPlaying = true;
			this.music.play();
			this.music.volume(this.muted ? 0 : 1);
		}
	}

	public stopMusic() {
		if (this.musicPlaying) {
			this.musicPlaying = false;
			this.music.stop();
		}
	}

	public setMute(mute:boolean) {
		this.muted = mute;
		this.music.volume(mute ? 0 : 1);
		for (let i in this.sounds) {
			this.sounds[i].volume(mute ? 0 : 1);
		}
	}
}
