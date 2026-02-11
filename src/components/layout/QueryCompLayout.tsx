import type { QueryObserverResult } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import SimpleLoader from "../SimpleLoader";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import ThemeProvider from "@/simpleComps/ThemeProvider";

interface QueryPageLayoutProps<TData> {
  query: QueryObserverResult<TData>;
  children?: React.ReactNode | ((data: TData) => React.ReactNode);
}

export default function QueryCompLayout<TData>(
  props: QueryPageLayoutProps<TData>,
) {
  const { children, query } = props;
  if (props.query.isLoading)
    return (
      <>
        <ThemeProvider className="flex-1 grid place-items-center bg-red-200">
          ...loading
        </ThemeProvider>
      </>
    );

  if (props.query.error) {
    const error = extract_message(props.query.error as AxiosError<ApiResponse>);
    return (
      <>
        <div className="p-4 h-[520px] grid place-items-center bg-base-300 rounded-md">
          <div className="p-4 space-y-4 ">
            <div className="text-xl font-bold floating-label">{error}</div>
            <button
              className="btn btn-error btn-block"
              onClick={() => props.query.refetch()}
            >
              Reload
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {typeof children === "function" ? children(query.data) : children}
    </div>
  );
}
