import {Physics} from 'phaser';
import {BulletData} from "../gameData/BulletData.ts";
import Bullet from "../entities/Bullet.ts";
import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";

export default class Weapon implements IComponent {
    public enabled: boolean = true;

    private readonly _bullets: Physics.Arcade.Group;
    private readonly _bulletData: BulletData;

    constructor(bullets: Physics.Arcade.Group, bulletData: BulletData) {
        if (!bullets) {
            console.error("Weapon 'bullets' group cannot be null or undefined");
        }

        this._bullets = bullets;
        this._bulletData = bulletData;
    }

    public spreadshot(source: Entity) {
        //start angle, amount of bullets, 
        const startAngle = Phaser.Math.DegToRad(15);
        const endAngle = Phaser.Math.DegToRad(-15);
        const amount = 3;
        const step = (endAngle - startAngle) / (amount - 1);

        
        for (let i = 0; i<amount; i++) {
            const angle = source.rotation + startAngle + step * i;
            const forward = new Phaser.Math.Vector2(1,0).rotate(angle);
            const velocity = forward.clone().scale(this._bulletData.speed);
            
            const bullet: Bullet = this._bullets.get() as Bullet;

            if (!bullet) continue;

            bullet.enable(
                source.x + forward.x * source.arcadeBody.radius,
                source.y + forward.y * source.arcadeBody.radius,
                velocity.x, velocity.y, this._bulletData
            );
        }  
    }

    public shoot(source: Entity) {
        if (!this.enabled)
            return;

        if (!this._bullets)
            return;

        const bullet: Bullet = this._bullets.get() as Bullet;
        if (bullet) {
            // Get forward vector of the source entity
            const sourceForward: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0).rotate(source.rotation);
            const bulletVelocity: Phaser.Math.Vector2 = sourceForward.clone().scale(this._bulletData.speed);
            bullet.enable(source.x + sourceForward.x * source.arcadeBody.radius, source.y + sourceForward.y * source.arcadeBody.radius,
                bulletVelocity.x, bulletVelocity.y, this._bulletData);

            // Maths way
            // const forwardVectorX: number = Math.cos(source.rotation);
            // const forwardVectorY: number = Math.sin(source.rotation);
            // const bulletVelocityX: number = forwardVectorX * this._bulletData.speed;
            // const bulletVelocityY: number = forwardVectorY * this._bulletData.speed;
            // bullet.enable(source.x + forwardVectorX * source.arcadeBody.radius, source.y + forwardVectorY * source.arcadeBody.radius,
            //     bulletVelocityX, bulletVelocityY, this._bulletData);
        }
    }
}