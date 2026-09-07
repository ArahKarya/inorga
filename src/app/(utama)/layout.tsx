import { DemoBar } from "@/components/DemoBar";
import { SmoothScroll } from "@/components/motion";
import { NavBawah } from "@/components/NavBawah";
import { Perangkat } from "@/components/Perangkat";

/** Kerangka untuk semua layar biasa: bilah peran, gulir halus, ruang di bawah bilah. */
export default function LayoutUtama({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <Perangkat />
      <DemoBar />
      <div className="ruang-bilah ruang-nav">{children}</div>
      <NavBawah />
    </>
  );
}
