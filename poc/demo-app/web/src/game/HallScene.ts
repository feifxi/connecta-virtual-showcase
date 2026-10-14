import * as Phaser from 'phaser';
import type { Room } from '@colyseus/sdk';
import { NetSync } from './NetSync';

export type Booth = { name: string; title: string; rect: Phaser.Geom.Rectangle };

export const HallEvents = {
  BOOTH_ENTER: 'booth-enter',
  BOOTH_LEAVE: 'booth-leave',
} as const;

const SPEED = 200;
const ARRIVE_DISTANCE = 4;

export class HallScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private target: Phaser.Math.Vector2 | null = null;
  private booths: Booth[] = [];
  private currentBooth: Booth | null = null;
  private net: NetSync | null = null;

  constructor() {
    super('hall');
  }

  preload() {
    this.load.tilemapTiledJSON('hall', '/assets/maps/hall.json');
    this.load.image('hall-tiles', '/assets/maps/hall-tiles.png');
    this.load.image('player', '/assets/sprites/player.png');
  }

  create() {
    const map = this.add.tilemap('hall');
    const tileset = map.addTilesetImage('hall-tiles', 'hall-tiles');
    if (!tileset) throw new Error('tileset "hall-tiles" not found in map');
    map.createLayer('floor', tileset, 0, 0);
    const walls = map.createLayer('walls', tileset, 0, 0);
    if (!walls) throw new Error('layer "walls" not found in map');
    walls.setCollisionByProperty({ collides: true });

    this.booths = (map.getObjectLayer('booths')?.objects ?? []).map((o) => ({
      name: o.name,
      title: (o.properties as { name: string; value: string }[] | undefined)?.find((p) => p.name === 'title')?.value ?? o.name,
      rect: new Phaser.Geom.Rectangle(o.x ?? 0, o.y ?? 0, o.width ?? 0, o.height ?? 0),
    }));
    for (const b of this.booths) {
      this.add
        .text(b.rect.centerX, b.rect.y + 36, b.title, { fontFamily: 'sans-serif', fontSize: '14px', color: '#1f2a44' })
        .setOrigin(0.5, 0);
    }

    const spawn = map.findObject('spawns', (o) => o.name === 'spawn');
    this.player = this.physics.add.sprite(spawn?.x ?? 100, spawn?.y ?? 100, 'player');
    this.player.setCircle(10, 2, 2);
    this.physics.add.collider(this.player, walls);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys('W,A,S,D') as typeof this.wasd;

    // Click to walk: straight line to the clicked point, stops on arrival or when keys are used
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.target = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
    });

    // Multiplayer only when the page passed a Colyseus room (S3+); S1 runs offline
    const room = this.registry.get('room') as Room | undefined;
    if (room) {
      this.net = new NetSync(this, room, this.player);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.net?.destroy());
    }
  }

  update(time: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const dir = new Phaser.Math.Vector2(
      Number(this.cursors.right.isDown || this.wasd.D.isDown) - Number(this.cursors.left.isDown || this.wasd.A.isDown),
      Number(this.cursors.down.isDown || this.wasd.S.isDown) - Number(this.cursors.up.isDown || this.wasd.W.isDown),
    );

    if (dir.lengthSq() > 0) {
      this.target = null;
    } else if (this.target) {
      const toTarget = this.target.clone().subtract(new Phaser.Math.Vector2(this.player.x, this.player.y));
      if (toTarget.length() <= ARRIVE_DISTANCE || (body.blocked.none === false && body.speed < 1)) {
        this.target = null;
      } else {
        dir.copy(toTarget);
      }
    }

    if (dir.lengthSq() > 0) {
      dir.normalize().scale(SPEED);
      body.setVelocity(dir.x, dir.y);
    } else {
      body.setVelocity(0, 0);
    }

    this.updateBooth();
    this.net?.update(time);
  }

  private updateBooth() {
    const inside = this.booths.find((b) => b.rect.contains(this.player.x, this.player.y)) ?? null;
    if (inside === this.currentBooth) return;
    if (this.currentBooth) this.game.events.emit(HallEvents.BOOTH_LEAVE, this.currentBooth.name);
    this.currentBooth = inside;
    if (inside) this.game.events.emit(HallEvents.BOOTH_ENTER, { name: inside.name, title: inside.title });
  }
}
