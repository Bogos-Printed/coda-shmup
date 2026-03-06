import { BulletData } from "./BulletData";

export type WeaponsData = {
    [key: string]: WeaponData;
}

export type WeaponData = {
  type: "single" | "spread";  
  spread: number;
  firerate: number;
  bullets: number;
  bulletSpeed: number;
  bulletBody: BulletData;
}