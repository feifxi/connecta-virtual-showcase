'use client';

import { useEffect, useRef, type RefObject } from 'react';
import * as Phaser from 'phaser';
import { PresetEvents, PresetScene, type Hearing, type LayoutInfo, type PlacedBooth, type PresetId } from '@/game/PresetScene';

export type BoothCard = PlacedBooth & { categories: boolean };
export type PresetGameHandle = {
  setPreset: (preset: PresetId, count: number, categories: boolean) => void;
  setup: (count: number, categories: boolean) => void;
  addBooth: () => void;
  setRange: (tiles: number) => void;
};

type Props = {
  control: RefObject<PresetGameHandle | null>; // next/dynamic does not forward refs, so the page passes its own
  onLayout?: (info: LayoutInfo) => void;
  onBoothEnter?: (b: BoothCard) => void;
  onBoothLeave?: () => void;
  onHearing?: (h: Hearing) => void;
};

export default function PresetGame({ control, onLayout, onBoothEnter, onBoothLeave, onHearing }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const handlers = useRef({ onLayout, onBoothEnter, onBoothLeave, onHearing });
  handlers.current = { onLayout, onBoothEnter, onBoothLeave, onHearing };

  const scene = () => gameRef.current?.scene.getScene('presets') as PresetScene | undefined;
  control.current = {
    setPreset: (preset, count, categories) => {
      gameRef.current?.registry.set('presetConfig', { count, categories });
      scene()?.scene.restart({ preset });
    },
    setup: (count, categories) => {
      gameRef.current?.registry.set('presetConfig', { count, categories });
      scene()?.setup(count, categories);
    },
    addBooth: () => scene()?.addBooth(),
    setRange: (tiles) => {
      gameRef.current?.registry.set('hearingRange', tiles);
      scene()?.setRange(tiles);
    },
  };

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: parentRef.current!,
      backgroundColor: '#efeaf6',
      pixelArt: true,
      physics: { default: 'arcade', arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene: [],
    });
    game.registry.set('presetConfig', { count: 18, categories: true });
    game.registry.set('hearingRange', 5);
    game.scene.add('presets', PresetScene, true, { preset: 'hall' });
    gameRef.current = game;
    window.__phaserGame = game;
    const layout = (i: LayoutInfo) => handlers.current.onLayout?.(i);
    const enter = (b: BoothCard) => handlers.current.onBoothEnter?.(b);
    const leave = () => handlers.current.onBoothLeave?.();
    const hearing = (h: Hearing) => handlers.current.onHearing?.(h);
    game.events.on(PresetEvents.LAYOUT, layout);
    game.events.on(PresetEvents.BOOTH_ENTER, enter);
    game.events.on(PresetEvents.BOOTH_LEAVE, leave);
    game.events.on(PresetEvents.HEARING, hearing);
    return () => {
      game.events.off(PresetEvents.LAYOUT, layout);
      game.events.off(PresetEvents.BOOTH_ENTER, enter);
      game.events.off(PresetEvents.BOOTH_LEAVE, leave);
      game.events.off(PresetEvents.HEARING, hearing);
      if (window.__phaserGame === game) window.__phaserGame = undefined;
      gameRef.current = null;
      game.destroy(true);
    };
  }, []);

  return <div ref={parentRef} style={{ width: '100%', height: '100%' }} />;
}
