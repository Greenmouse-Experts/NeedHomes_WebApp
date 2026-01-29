import type { QueryObserverResult } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { JSX } from "react/jsx-runtime";
import type { AxiosError } from "axios";
import type React from "react";
import type { ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import SimpleLoader from "../SimpleLoader";

interface QueryPageLayoutProps extends PropsWithChildren {
  query: QueryObserverResult;

  headerActions?: React.ReactNode | any;
}

export default function QueryPageLayout(props: QueryPageLayoutProps) {
  if (props.query.isLoading)
    return (
      <>
        <SimpleLoader />
      </>
    );

  if (props.query.error) {
    const error = extract_message(props.query.error as AxiosError<ApiResponse>);
    return (
      <>
        <div className="p-4 h-[520px] grid place-items-center bg-base-300 rounded-md">
          <div className="p-4 space-y-4 ">
            <div className="text-lg text-center fieldset-label font-bold floating-label  wrap-anywhere">
              {error}
            </div>
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

  if (props.query.isSuccess || props.query.data)
    return (
      <>
        <div className="mt-4">{props.children}</div>
      </>
    );
}
