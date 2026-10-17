import type { Role } from "@/lib/data";
import { HallView } from "./hall-view";

const ROLES: Role[] = ["Visitor", "Presenter", "Judge", "Admin"];

// Phaser hall (map from poc/demo-app · characters and controls from poc/TestUI) · ?as=Presenter|Judge|Admin starts in that role
export default async function HallPage({ searchParams }: PageProps<"/e/[slug]/hall">) {
  const { as } = await searchParams;
  return <HallView initialRole={ROLES.find((r) => r === as) ?? "Visitor"} />;
}
