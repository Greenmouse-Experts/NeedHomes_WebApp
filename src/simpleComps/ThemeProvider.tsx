import type { PropsWithChildren } from "react";

export default function ThemeProvider(props: PropsWithChildren) {
  return (
    <div className="flex-1" data-theme="nh-light">
      {props.children}
    </div>
  );
}
