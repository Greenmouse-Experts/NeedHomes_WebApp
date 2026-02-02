import type { PropsWithChildren } from "react";

export default function ThemeProvider(
  props: PropsWithChildren<{ className?: string }>,
) {
  return (
    <div
      className={`flex-1  bg-transparent ${props.className || ""} `}
      data-theme="nh-light"
      id="myapp"
    >
      {props.children}
    </div>
  );
}
