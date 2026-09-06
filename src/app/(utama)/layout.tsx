import { DemoBar } from "@/components/DemoBar";
import { SmoothScroll } from "@/components/motion";

/** Kerangka untuk semua layar biasa: bilah peran, gulir halus, ruang di bawah bilah. */
export default function LayoutUtama({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <DemoBar />
      <div className="pt-[71px]">{children}</div>
    </>
  );
}
