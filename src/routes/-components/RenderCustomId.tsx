import type { ADMIN_PROPERTY_LISTING } from "@/types";
import { CopyButton } from "./CopyButton";

export const RenderCustomId = (prop: { property: ADMIN_PROPERTY_LISTING }) => {
  const customId = prop.property.customId;
  return (
    <div className="my-3 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 shadow-sm backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary/60">
          Property ID
        </span>
        <span className="max-w-[220px] truncate rounded-md bg-background/70 px-2 py-1 font-mono text-sm font-bold text-primary">
          {customId}
        </span>
      </div>
      <CopyButton text={customId} />
    </div>
  );
};
