import type { Role } from "@/lib/data";
import { HallView, type Net } from "./hall-view";

const ROLES: Role[] = ["Visitor", "Presenter", "Judge", "Admin"];
const NETS: Net[] = ["ok", "server", "audio", "reconnecting"];

// Phaser hall (map from poc/demo-app · characters and controls from poc/TestUI) · ?as=Presenter|Judge|Admin starts in that role · ?net=server|audio|reconnecting previews connection problems
export default async function HallPage({ searchParams }: PageProps<"/e/[slug]/hall">) {
  const { as, net } = await searchParams;
  return <HallView initialRole={ROLES.find((r) => r === as) ?? "Visitor"} initialNet={NETS.find((n) => n === net) ?? "ok"} />;
}
