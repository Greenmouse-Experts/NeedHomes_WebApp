import type { PropsWithChildren } from "react";

export default function ThemeProvider(props: PropsWithChildren) {
  return (
    <div className="flex-1 bg-transparent" data-theme="nh-light">
      {props.children}
    </div>
  );
}
