import Enemy from './Enemy';
import { Cooldown } from './util';
import * as Hearts from './Hearts';

export default class GoldEnemy extends Enemy {
	protected emoji: string = Hearts.yellow;

	protected moveCooldown: Cooldown = new Cooldown(40);

}
