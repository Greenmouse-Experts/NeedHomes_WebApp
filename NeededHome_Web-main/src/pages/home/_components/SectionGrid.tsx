import type { PropsWithChildren } from "react";
interface SectionGridProps extends PropsWithChildren {
  className?: string;
}

export default function SectionGrid(props: SectionGridProps) {
  return (
    <div
      className={
        "contain mx-auto flex min-h-[520px] flex-col lg:flex-row " +
        props.className
      }
    >
      {props.children}
    </div>
  );
}
