import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, AlertTriangle } from "lucide-react";
import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SimpleContainer from "@/simpleComps/SimpleContainer";
import QueryCompLayout from "@/components/layout/QueryCompLayout";

interface SearchParams {
  token: string;
}

interface SecurityQuestion {
  id: string;
  question: string;
}

export const Route = createFileRoute("/withdrawal-pin/verify-answer")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>): SearchParams => ({
    token: search.token ?? "",
  }),
});

function RouteComponent() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const questionsQuery = useQuery<SecurityQuestion[]>({
    queryKey: ["withdrawal-pin-questions"],
    queryFn: async () => {
      const res = await apiClient.get("/withdrawal-pin/questions");
      return res.data;
    },
  });

  const form = useForm({
    defaultValues: {
      newPin: "",
      confirmPin: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const recoverMutation = useMutation({
    mutationFn: async (data: {
      recoveryToken: string;
      newPin: string;
      securityQuestion: string;
      securityAnswer: string;
    }) => {
      const res = await apiClient.post("/withdrawal-pin/recover", data);
      return res.data;
    },
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });

  if (!token) {
    return (
      <SimpleContainer>
        <div className="flex-1 grid place-items-center">
          <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-error mx-auto" />
            <h2 className="text-xl font-semibold">Invalid Recovery Link</h2>
            <p className="text-sm text-gray-500">
              This recovery link is missing or invalid. Please contact support for a new one.
            </p>
            <button className="btn btn-primary w-full" onClick={() => navigate({ to: "/" })}>
              Go to Homepage
            </button>
          </div>
        </div>
      </SimpleContainer>
    );
  }

  return (
    <SimpleContainer>
      <div className="flex-1 grid place-items-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 ring fade space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <KeyRound className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Reset Withdrawal PIN</h2>
              <p className="text-sm text-gray-500">Set a new PIN and security question</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Create a new withdrawal PIN and security question. This recovery link expires after 1 hour.
          </p>

          <form
            onSubmit={form.handleSubmit((data) => {
              if (data.newPin !== data.confirmPin) {
                form.setError("confirmPin", { message: "PINs do not match" });
                return;
              }
              toast.promise(
                recoverMutation.mutateAsync({
                  recoveryToken: token,
                  newPin: data.newPin,
                  securityQuestion: data.securityQuestion,
                  securityAnswer: data.securityAnswer,
                }),
                {
                  loading: "Resetting PIN...",
                  success: "PIN reset successfully.",
                  error: extract_message,
                },
              );
            })}
            className="space-y-4"
          >
            <Controller
              name="newPin"
              control={form.control}
              rules={{
                required: "PIN is required",
                pattern: { value: /^\d{4,6}$/, message: "PIN must be 4–6 digits" },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SimpleInput
                    {...field}
                    label="New PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                  />
                  {fieldState.error && (
                    <p className="text-error text-xs">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="confirmPin"
              control={form.control}
              rules={{ required: "Please confirm your PIN" }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SimpleInput
                    {...field}
                    label="Confirm New PIN"
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                  />
                  {fieldState.error && (
                    <p className="text-error text-xs">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <div className="divider text-xs text-gray-400">Security Question</div>

            <QueryCompLayout
              query={questionsQuery}
              customLoading={
                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                  <span className="loading loading-spinner loading-xs" />
                  Loading questions...
                </div>
              }
            >
              {(data) => {
                const questions: SecurityQuestion[] = Array.isArray(data)
                  ? data
                  : (data as any)?.data ?? [];
                return (
                  <div className="space-y-1">
                    <LocalSelect
                      {...form.register("securityQuestion", {
                        required: "Please select a question",
                      })}
                      label="Security Question"
                    >
                      <option value="">Select a question</option>
                      {questions.map((q) => (
                        <option key={q.id} value={q.question}>
                          {q.question}
                        </option>
                      ))}
                    </LocalSelect>
                    {form.formState.errors.securityQuestion && (
                      <p className="text-error text-xs">
                        {form.formState.errors.securityQuestion.message as string}
                      </p>
                    )}
                  </div>
                );
              }}
            </QueryCompLayout>

            <Controller
              name="securityAnswer"
              control={form.control}
              rules={{
                required: "Answer is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 100, message: "Max 100 characters" },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <SimpleInput {...field} label="Your Answer" placeholder="Your answer" />
                  {fieldState.error && (
                    <p className="text-error text-xs">{fieldState.error.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Remember this — you'll need it to reset your PIN in the future.
                  </p>
                </div>
              )}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={recoverMutation.isPending}
            >
              {recoverMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save New PIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </SimpleContainer>
  );
}
