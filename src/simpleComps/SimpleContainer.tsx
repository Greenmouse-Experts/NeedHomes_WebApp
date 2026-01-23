import type { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  useTheme?: boolean;
}
export default function SimpleContainer(props: ContainerProps) {
  const { useTheme = true } = props;
  return (
    <div
      className="flex min-h-[calc(100dvh-96px)] container mx-auto px-4"
      data-theme={useTheme ? "nh-light" : ""}
    >
      {props.children}
    </div>
  );
}
