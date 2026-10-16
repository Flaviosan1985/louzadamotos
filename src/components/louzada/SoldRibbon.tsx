export function SoldRibbon() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] bg-[#c41e3a] py-2 text-center text-sm font-bold tracking-[0.25em] text-white shadow-lg uppercase">
        Vendida
      </div>
    </div>
  );
}
