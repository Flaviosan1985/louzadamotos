import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`mb-10 sm:mb-14 max-w-3xl ${alignClass}`}>
      <p className="text-[#c41e3a] text-xs font-bold uppercase tracking-widest mb-2">
        {eyebrow}
      </p>
      <h2
        className="font-display font-black italic uppercase leading-none text-white"
        style={{ fontSize: "clamp(34px, 8vw, 68px)" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="text-[#888] text-sm sm:text-base mt-3 max-w-md">{description}</p>
      ) : null}
    </div>
  );
}
