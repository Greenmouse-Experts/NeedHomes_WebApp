import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function RenderDescription({ description }: { description: string }) {
  const clean = useMemo(
    () => DOMPurify.sanitize(description ?? ""),
    [description],
  );

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
