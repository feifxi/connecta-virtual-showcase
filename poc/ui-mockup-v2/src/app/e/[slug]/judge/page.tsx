import { Hall } from "@/components/hall";

export default async function JudgePage({ params }: PageProps<"/e/[slug]/judge">) {
  const { slug } = await params;
  return <Hall mode="judge" slug={slug} />;
}
