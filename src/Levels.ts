export enum E {
	RED,
	RED2,
	RED4,
	NONE,
	FAST,
	MULTI,
	SPIN,
	SPIN4,
	STRONG,
	GOLD,
	GOLD10
}

export const LEVELS = [
	[
		E.RED,
		E.RED,
		E.RED,
		E.RED,
		E.RED,
		E.RED,
		E.RED,
		E.GOLD
	],
	[
		E.RED,
		E.RED,
		E.RED,
		E.RED2,
		E.NONE,
		E.RED4,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.STRONG,
		E.STRONG,
		E.NONE,
		E.STRONG,
		E.RED2,
		E.NONE,
		E.STRONG,
		E.STRONG,
		E.STRONG,
		E.NONE,
		E.GOLD
	],
	[
		E.SPIN,
		E.SPIN,
		E.RED,
		E.RED,
		E.SPIN,
		E.SPIN4,
		E.RED,
		E.RED,
		E.RED,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.SPIN,
		E.SPIN,
		E.RED,
		E.RED4,
		E.NONE,
		E.NONE,
		E.STRONG,
		E.SPIN4,
		E.STRONG,
		E.STRONG,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.STRONG,
		E.RED4,
		E.SPIN,
		E.SPIN,
		E.SPIN,
		E.STRONG,
		E.STRONG,
		E.NONE,
		E.NONE,
		E.STRONG,
		E.SPIN,
		E.RED,
		E.RED,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.MULTI,
		E.NONE,
		E.NONE,
		E.MULTI,
		E.NONE,
		E.MULTI,
		E.NONE,
		E.RED2,
		E.NONE,
		E.SPIN4,
		E.MULTI,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.FAST,
		E.NONE,
		E.NONE,
		E.STRONG,
		E.FAST,
		E.SPIN4,
		E.FAST,
		E.FAST,
		E.FAST,
		E.STRONG,
		E.SPIN,
		E.MULTI,
		E.FAST,
		E.FAST,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.FAST,
		E.FAST,
		E.FAST,
		E.MULTI,
		E.SPIN4,
		E.SPIN4,
		E.SPIN4,
		E.FAST,
		E.STRONG,
		E.MULTI,
		E.NONE,
		E.NONE,
		E.NONE,
		E.NONE,
		E.NONE,
		E.GOLD
	],
	[
		E.SPIN4,
		E.SPIN4,
		E.SPIN4,
		E.STRONG,
		E.STRONG,
		E.NONE,
		E.NONE,
		E.NONE,
		E.RED,
		E.FAST,
		E.FAST,
		E.RED4,
		E.MULTI,
		E.NONE,
		E.NONE,
		E.NONE,
		E.SPIN4,
		E.SPIN4,
		E.GOLD10
	]
];
