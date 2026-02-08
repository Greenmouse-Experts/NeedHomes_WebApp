import type { Props } from "recharts/types/cartesian/Funnel";
import ThemeProvider from "./ThemeProvider";
import type { PropsWithChildren } from "react";

interface AvatarProps {
  url: string;
  alt?: string;
  className?: string;
}

export default function SimpleAvatar({
  url,
  alt,
  className,
}: PropsWithChildren<AvatarProps>) {
  const isUrl = url?.trim();
  const firstLetter = alt?.charAt(0).toUpperCase() || "A";
  return (
    <div className="avatar">
      <div className={`size-24 rounded-full flex ${className}`}>
        {isUrl ? (
          <img src={url} alt={alt} className="flex-1" />
        ) : (
          <div className="flex-1 bg-primary rounded-full grid place-items-center text-2xl text-white">
            {firstLetter}
          </div>
        )}
      </div>
    </div>
  );
}
