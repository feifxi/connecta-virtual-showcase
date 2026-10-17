'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { ShowcaseEvents, ShowcaseScene, type ShowcaseBooth } from '@/game/ShowcaseScene';

export type BoothInfo = Omit<ShowcaseBooth, 'rect'>;

type Props = {
  onBoothEnter?: (booth: BoothInfo) => void;
  onBoothLeave?: (no: string) => void;
  onNearby?: (names: string[]) => void;
};

export default function ShowcaseGame({ onBoothEnter, onBoothLeave, onNearby }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onBoothEnter, onBoothLeave, onNearby });
  handlers.current = { onBoothEnter, onBoothLeave, onNearby };

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: parentRef.current!,
      backgroundColor: '#efeaf6',
      pixelArt: true,
      physics: { default: 'arcade', arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene: [ShowcaseScene],
    });
    window.__phaserGame = game;
    const enter = (b: BoothInfo) => handlers.current.onBoothEnter?.(b);
    const leave = (no: string) => handlers.current.onBoothLeave?.(no);
    const nearby = (names: string[]) => handlers.current.onNearby?.(names);
    game.events.on(ShowcaseEvents.BOOTH_ENTER, enter);
    game.events.on(ShowcaseEvents.BOOTH_LEAVE, leave);
    game.events.on(ShowcaseEvents.NEARBY, nearby);
    return () => {
      game.events.off(ShowcaseEvents.BOOTH_ENTER, enter);
      game.events.off(ShowcaseEvents.BOOTH_LEAVE, leave);
      game.events.off(ShowcaseEvents.NEARBY, nearby);
      if (window.__phaserGame === game) window.__phaserGame = undefined;
      game.destroy(true);
    };
  }, []);

  return <div ref={parentRef} style={{ width: '100%', height: '100%' }} />;
}
