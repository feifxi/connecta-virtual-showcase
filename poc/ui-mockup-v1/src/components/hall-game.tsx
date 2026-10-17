"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as Phaser from "phaser";
import { HallEvents, HallScene, type BoothInfo, type Hearing, type HallProject, type HallZone } from "@/game/HallScene";

export type HallControl = { zoom: (z: number) => void; goTo: (no: string) => void };

// Mounts the Phaser hall (client only) · the page passes callbacks and gets a small control object back
export default function HallGame({ projects, zones, title, avatar, name, control, onEnter, onLeave, onHearing }: {
  projects: HallProject[]; zones: HallZone[]; title: string; avatar: number; name: string; control: RefObject<HallControl | null>;
  onEnter: (b: BoothInfo) => void; onLeave: () => void; onHearing: (h: Hearing) => void;
}) {
  const parent = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onEnter, onLeave, onHearing });
  handlers.current = { onEnter, onLeave, onHearing };

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: parent.current!,
      backgroundColor: "#eef0fa",
      pixelArt: true,
      physics: { default: "arcade", arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
      scene: [],
    });
    game.scene.add("hall", HallScene, true, { projects, zones, title, avatar, name });
    const scene = () => game.scene.getScene("hall") as HallScene | undefined;
    control.current = { zoom: (z) => scene()?.setZoom(z), goTo: (no) => scene()?.goToBooth(no) };
    (window as unknown as { __phaserGame?: Phaser.Game }).__phaserGame = game;
    const enter = (b: BoothInfo) => handlers.current.onEnter(b);
    const leave = () => handlers.current.onLeave();
    const hearing = (h: Hearing) => handlers.current.onHearing(h);
    game.events.on(HallEvents.ENTER, enter);
    game.events.on(HallEvents.LEAVE, leave);
    game.events.on(HallEvents.HEARING, hearing);
    return () => {
      game.events.off(HallEvents.ENTER, enter);
      game.events.off(HallEvents.LEAVE, leave);
      game.events.off(HallEvents.HEARING, hearing);
      control.current = null;
      game.destroy(true);
    };
    // the hall is created once per page visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={parent} className="absolute inset-0" />;
}
