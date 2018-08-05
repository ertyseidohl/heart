///<reference path="howler.d.ts" />
export default class SoundEngine {
	public static MAX_VOL: number = 0.5;

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
				src: [
					"sounds/" + soundsToLoad[i] + ".webm",
					"sounds/" + soundsToLoad[i] + ".wav"
				]
			});
		}

		this.music = new Howl({
			src: [
				"sounds/HeartBrokenButNotSquishy.webm",
				"sounds/HeartBrokenButNotSquishy.mp3"
			],
			loop: true
		});
	}

	public play(sound:string) {
		this.sounds[sound].play();
		this.sounds[sound].volume(this.muted ? 0 : SoundEngine.MAX_VOL);
	}

	public startMusic() {
		if (!this.musicPlaying) {
			this.musicPlaying = true;
			this.music.play();
			this.music.volume(this.muted ? 0 : SoundEngine.MAX_VOL);
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
		this.music.volume(mute ? 0 : SoundEngine.MAX_VOL);
		for (let i in this.sounds) {
			this.sounds[i].volume(mute ? 0 : SoundEngine.MAX_VOL);
		}
	}
}
