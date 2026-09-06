/**
 * Lambang INORGA bergerak. Mekaniknya sama dengan referensi Apex Lab —
 * cincin menggambar dirinya sendiri (stroke-dashoffset), glyph tersapu masuk
 * (clip-path), dan satu titik mengorbit secara berkala.
 *
 * Bentuknya sendiri asli: cincin dengan titik yang mengorbit membaca sebagai
 * radar pemanduan bakat, dan glyph "I" untuk INORGA.
 */
const R = 15;
const KELILING = +(2 * Math.PI * R).toFixed(2);

export function LogoMark() {
  return (
    <svg
      className="logo-mark"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ ["--ring-c" as string]: KELILING }}
    >
      <circle
        className="ring"
        cx="20"
        cy="20"
        r={R}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
      <g className="dial">
        <circle cx="20" cy="5" r="2" fill="var(--color-aksen)" />
      </g>
      <g className="glyph">
        <path
          d="M20 13v14"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M16 13h8M16 27h8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
