'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { HallEvents, HallScene } from '@/game/HallScene';

type Props = {
  onBoothEnter?: (booth: { name: string; title: string }) => void;
  onBoothLeave?: (name: string) => void;
};

// Debug hooks for spike checks (POC only)
declare global {
  interface Window {
    __phaserGames?: number;
    __phaserGame?: Phaser.Game;
    __Phaser?: typeof Phaser;
  }
}

export default function PhaserGame({ onBoothEnter, onBoothLeave }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onBoothEnter, onBoothLeave });
  handlers.current = { onBoothEnter, onBoothLeave };

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: parentRef.current!,
      backgroundColor: '#2b2f3a',
      pixelArt: true,
      physics: { default: 'arcade', arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene: [HallScene],
    });
    window.__phaserGames = (window.__phaserGames ?? 0) + 1;
    window.__phaserGame = game;
    window.__Phaser = Phaser;

    const enter = (b: { name: string; title: string }) => handlers.current.onBoothEnter?.(b);
    const leave = (name: string) => handlers.current.onBoothLeave?.(name);
    game.events.on(HallEvents.BOOTH_ENTER, enter);
    game.events.on(HallEvents.BOOTH_LEAVE, leave);

    return () => {
      game.events.off(HallEvents.BOOTH_ENTER, enter);
      game.events.off(HallEvents.BOOTH_LEAVE, leave);
      game.events.once(Phaser.Core.Events.DESTROY, () => {
        window.__phaserGames = (window.__phaserGames ?? 1) - 1;
      });
      if (window.__phaserGame === game) window.__phaserGame = undefined;
      game.destroy(true);
    };
  }, []);

  return <div ref={parentRef} style={{ width: '100%', height: '100%' }} />;
}
