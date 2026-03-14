import apiClient, { type ApiResponse } from "@/api/simpleApi";
import Footer from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import type { Terms } from "../dashboard/terms/index";

export const Route = createFileRoute("/terms/$termsId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { termsId } = Route.useParams();
  const termsType = termsId as Terms["type"];

  const query = useQuery<ApiResponse<Terms>>({
    queryKey: ["public-terms", termsType],
    queryFn: async () => {
      const resp = await apiClient.get(`terms?type=${termsType}`);
      return resp.data;
    },
  });

  const term = query.data?.data;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <div className="flex items-center gap-4 mb-4">
              <Scale className="w-12 h-12 text-brand-orange" />
              <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
                {query.isLoading ? (
                  <span className="opacity-40">Terms & Conditions</span>
                ) : (
                  <>
                    {term?.title ?? "Terms & Conditions"}
                    <span className="text-brand-orange">.</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-white/80 mt-4 text-lg max-w-3xl">
              Please read these terms carefully before creating your account.
              These terms govern your use of NeedHomes services.
            </p>
            {term && (
              <p className="text-white/60 mt-4 text-sm">
                Version {term.version} &middot; Last updated:{" "}
                {new Date(term.updatedAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              {query.isLoading && (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-base-300 rounded animate-pulse"
                      style={{ width: `${70 + (i % 3) * 10}%` }}
                    />
                  ))}
                </div>
              )}

              {query.isError && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Unable to load terms. Please try again later.
                  </p>
                </div>
              )}

              {term && (
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:text-[#333d42]
                    prose-h2:text-3xl prose-h2:font-medium
                    prose-h3:text-xl prose-h3:font-medium
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-li:text-muted-foreground
                    prose-strong:text-[#333d42]
                    prose-a:text-brand-orange hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: term.content }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Contact footer */}
        <section className="py-20 bg-[#333d42]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Scale className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-medium text-white mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                If you have questions or need clarification, please contact our
                legal team.
              </p>
              <div className="space-y-2 text-white/90">
                <p className="font-medium">Email: legal@needhomes.ng</p>
                <p className="font-medium">Phone: +234 702 500 5857</p>
                <p className="text-sm text-white/60 mt-4">
                  Address: 9 Orchid Road, Lekki, Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
