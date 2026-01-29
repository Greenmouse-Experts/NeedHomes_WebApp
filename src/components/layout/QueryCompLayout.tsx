import type { QueryObserverResult } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import SimpleHeader from "../SimpleHeader";
import SimpleLoader from "../SimpleLoader";
import { extract_message } from "@/helpers/auth";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/apiClient";

interface QueryPageLayoutProps extends PropsWithChildren {
  query: QueryObserverResult;
}

export default function QueryCompLayout(props: QueryPageLayoutProps) {
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

  if (props.query.isSuccess && props.query.data) return <>{props.children}</>;
}
