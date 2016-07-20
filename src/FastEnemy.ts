import Enemy from './Enemy';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

export default class FastEnemy extends Enemy {
	protected emoji: string = Hearts.with_arrow;
	protected moveCooldown: Cooldown = new Cooldown(10);
}
