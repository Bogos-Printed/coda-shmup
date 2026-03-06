import Entity from './Entity.ts';
import Health from "../components/Health.ts";
import Movement from "../components/Movement.ts";
import Weapon from "../components/Weapon.ts";
import { WeaponData } from '../gameData/WeaponData.ts';

export default class Enemy extends Entity {
    private _shootTimerConfig: Phaser.Types.Time.TimerEventConfig;
    private _shootTimer: Phaser.Time.TimerEvent;
    private _movementType: number;
    private _weaponData: WeaponData;

    public init(bulletsGroup: Phaser.Physics.Arcade.Group) {
        this.addComponent(new Health(1, this));
        this.addComponent(new Movement(0.2));

        const weapons = this.scene.cache.json.get('weapons');
        this._weaponData = weapons[1]
        this.addComponent(new Weapon(bulletsGroup, this._weaponData));

        this.angle = 90;

        this._shootTimerConfig = {
            delay: Phaser.Math.Between(2000, 3000),
            callback: this.shoot,
            callbackScope: this,
            loop: true
        };
        this._shootTimer = this.scene.time.addEvent(this._shootTimerConfig);

        // Create animation when enemy is about to shoot in the global animation manager
        if (!this.scene.anims.exists('ufoShoot')) {
            this.scene.anims.create({
                key: 'ufoShoot',
                frames: [
                    {key: 'sprites', frame: 'ufoRed.png'},
                    {key: 'sprites', frame: 'ufoRed-shoot0.png'},
                    {key: 'sprites', frame: 'ufoRed-shoot1.png'}
                ],
                frameRate: 4,
            });
        }

        this.arcadeBody.setCircle(this.displayWidth / 2);
    }

    public enable(x: number, y: number) {
        this.enableBody(true, x, y - this.displayHeight, true, true);
        this._shootTimer.reset(this._shootTimerConfig);
        this._movementType = Phaser.Math.Between(0,1);
        const health = this.getComponent(Health);
        health?.on(Health.CHANGE_EVENT, () => {
            this.setTintFill(0xffffff);

            if (health?.current == 0)
            {
                this.disableBody();
            }

            this.scene.time.delayedCall(50, () => {
                this.clearTint();

                if (health?.current == 0)
                {
                    this.disable();
                }
            });
        });

        // Restore health, in case the enemy is reused from the pool, without emitting events
        health?.heal(health!.max, false);
    }

    public disable() {
        this.stop();
        this.removeAllListeners(Phaser.Animations.Events.ANIMATION_COMPLETE);

        this.disableBody(true, true);
        this._shootTimer.paused = true;
    }

    private shoot() {
        this.play('ufoShoot');
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setTexture('sprites', 'ufoRed.png');

            this.getComponent(Weapon)?.shoot(this);
            this.scene.sound.play('sfx_laser2');
        });
    }

    preUpdate(timeSinceLaunch: number, deltaTime: number) {
        super.preUpdate(timeSinceLaunch, deltaTime)

        // Destroy entities when out of screen
        if (this.y > this.scene.cameras.main.height + this.displayHeight) {
            this.disable();
        }

        if (!this.isTinted)
            if (this._movementType)
                this.getComponent(Movement)?.moveVertically(this, deltaTime);
            else 
                this.getComponent(Movement)?.moveWave(this, deltaTime * 0.4, 50);
        else
            this.getComponent(Movement)?.moveVertically(this, deltaTime * 0.5);
    }
}