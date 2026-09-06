import { ProfilAtlet } from "@/components/ProfilAtlet";
import { ATLET } from "@/data/atlet";

export const dynamicParams = true;
export function generateStaticParams() {
  return ATLET.map((a) => ({ id: a.id }));
}

export default async function HalamanDetailAtlet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfilAtlet atletId={id} />;
}
