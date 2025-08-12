import Link from "next/link";

export default function FloatingAdsButton() {
  return (
    <Link
      href="/contato"
      className="fixed sm:hidden right-0 top-1/2 -translate-y-1/2 z-30 bg-primary text-white px-6 py-1 rounded-l-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group writing-mode-vertical"
      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="font-semibold text-sm tracking-wider">
          ANUNCIE SUA MARCA
        </span>
      </div>
    </Link>
  );
}
