import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";

export default class Movement implements IComponent {
    public enabled: boolean = true;

    private _speed: number = 0;

    public get speed(): number {
        return this._speed;
    }

    public constructor(speed?: number) {
        if (speed) {
            this._speed = speed;
        }
    }

    public setSpeed(speed: number) {
        this._speed = speed;
    }

    public moveHorizontally(entity: Entity, deltaTime: number) {
        if (!this.enabled)
            return;

        entity.x += this._speed * deltaTime;
    }

    public moveVertically(entity: Entity, deltaTime: number) {
        if (!this.enabled)
            return;

        entity.y += this._speed * deltaTime;
    }

    public moveWave(entity: Entity, deltaTime: number, waveOffset: number) {
        if (!this.enabled)
            return;
        
        const scene = entity.scene.scale.width
        const amplitude = 400;
        const center = scene/2;
        const frequency = 0.02 + this._speed/100;

        
        entity.y += this._speed * deltaTime;
        entity.x = center + Math.sin(entity.y * frequency + waveOffset) * amplitude;
    }
}