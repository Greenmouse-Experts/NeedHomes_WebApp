import type { QueryObserverResult } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import SimpleLoader from "../SimpleLoader";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { Loader2 } from "lucide-react";

interface QueryPageLayoutProps<TData> {
  query: QueryObserverResult<TData>;
  children?: React.ReactNode | ((data: TData) => React.ReactNode);
  loadingText?: string;
}

export default function QueryCompLayout<TData>(
  props: QueryPageLayoutProps<TData>,
) {
  const { children, query, loadingText = "Loading resources..." } = props;
  const loading = query.isLoading;
  if (loading)
    return (
      <>
        <ThemeProvider className="flex-1 w-full min-h-52  bg-white fade ring rounded-box grid place-items-center  flex-col items-center justify-center p-8 animate-in fade-in duration-700">
          <div className="space-y-8">
            <div className="relative flex items-center justify-center">
              {/* Animated Rings */}
              <div className="absolute h-24 w-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin duration-[2000ms]" />
              <div className="absolute h-20 w-20 rounded-full border-4 border-primary/5 border-b-primary/40 animate-spin-reverse duration-[3000ms]" />

              {/* Center Icon */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-semibold tracking-tight text-base-content/80">
                {loadingText}
              </h3>
              {/*<p className="text-sm text-base-content/50 max-w-[200px] leading-relaxed">
                  Please wait while we prepare your dashboard experience.
                </p>*/}
            </div>
          </div>
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
