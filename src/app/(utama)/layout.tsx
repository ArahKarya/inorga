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
      <div className="pt-[62px] pb-[70px] sm:pt-[71px] md:pb-0">{children}</div>
      <NavBawah />
    </>
  );
}
