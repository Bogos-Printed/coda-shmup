import {Physics} from 'phaser';
import {BulletData} from "../gameData/BulletData.ts";
import Bullet from "../entities/Bullet.ts";
import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";
import { WeaponData } from '../gameData/WeaponData.ts';

export default class Weapon implements IComponent {
    public enabled: boolean = true;

    private readonly _bullets: Physics.Arcade.Group;
    private readonly _bulletData: BulletData;
    private _weapon: WeaponData;

    constructor(bullets: Physics.Arcade.Group, bulletData: BulletData, weaponConfig: WeaponData) {
        if (!bullets) {
            console.error("Weapon 'bullets' group cannot be null or undefined");
        }

        this._bullets = bullets;
        this._bulletData = bulletData;
        this._weapon = weaponConfig;
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

    public setWeaponData(data: WeaponData) {
        this._weapon = data;
    }

    public shoot(source: Entity) {
        if (!this.enabled || !this._bullets) return;

        const spreadRad = Phaser.Math.DegToRad(this._weapon.spread);
        const startAngle = -spreadRad / 2;
        const step = this._weapon.bullets > 1 ? spreadRad / (this._weapon.bullets - 1) : 0;

        for (let i = 0; i<this._weapon.bullets; i++) {
            const angle = source.rotation + startAngle + step * i;

            const forward = new Phaser.Math.Vector2(1,0).rotate(angle);
            const velocity = forward.clone().scale(this._weapon.bulletSpeed);
            
            const bullet: Bullet = this._bullets.get() as Bullet;
            if (!bullet) continue;

            bullet.enable(
                source.x + forward.x * source.arcadeBody.radius,
                source.y + forward.y * source.arcadeBody.radius,
                velocity.x, velocity.y, 
                this._bulletData
            );
        } 

        // Maths way
        // const forwardVectorX: number = Math.cos(source.rotation);
        // const forwardVectorY: number = Math.sin(source.rotation);
        // const bulletVelocityX: number = forwardVectorX * this._bulletData.speed;
        // const bulletVelocityY: number = forwardVectorY * this._bulletData.speed;
        // bullet.enable(source.x + forwardVectorX * source.arcadeBody.radius, source.y + forwardVectorY * source.arcadeBody.radius,
        // bulletVelocityX, bulletVelocityY, this._bulletData);
    }
}