import { ProfilAtlet } from "@/components/ProfilAtlet";
import { ATLET_DEMO } from "@/data/atlet";

/** Layar atlet persona demo: Andi Saputra. */
export default function HalamanAtlet() {
  return <ProfilAtlet atletId={ATLET_DEMO} persona />;
}
