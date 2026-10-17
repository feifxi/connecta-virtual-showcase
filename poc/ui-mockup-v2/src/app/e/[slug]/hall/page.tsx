import { Hall } from "@/components/hall";

export default async function HallPage({ params, searchParams }: PageProps<"/e/[slug]/hall">) {
  const { slug } = await params;
  const { booth } = await searchParams;
  return <Hall mode="visitor" slug={slug} startBooth={typeof booth === "string" ? booth : undefined} />;
}
