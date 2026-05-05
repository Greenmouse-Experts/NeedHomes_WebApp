import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageCircle, HelpCircle, Plus, Minus } from "lucide-react";
import Footer from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Renderer } from "leaflet";
import RenderFormattedText from "@/components/RenderFormattedText";

export const Route = createFileRoute("/faqs")({
  component: RouteComponent,
});

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { data, isLoading } = useQuery<ApiResponse<FAQ[]>>({
    queryKey: ["faqs-public"],
    queryFn: async () => {
      const resp = await apiClient.get("faqs");
      return resp.data;
    },
  });

  const faqs = (data?.data as any as FAQ[]) ?? [];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredQuestions = faqs.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <section className="bg-[#333d42] py-20">
        <div className="contain mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
            FAQs<span className="text-brand-orange">.</span>
          </h1>
        </div>
      </section>
      <div className="min-h-screen bg-background pb-20 mt-20 flex flex-col items-center">
        {/* Hero Section */}
        {/* <section className="relative w-full overflow-hidden bg-brand-orange/5 py-20 lg:py-32 flex justify-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-orange blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-orange-dark blur-3xl" />
          </div>

          <div className="contain px-6 relative z-10 text-center w-full">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-brand-orange uppercase bg-brand-orange/10 rounded-full animate-fade-in-down">
              Help Center
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              How can we <span className="text-brand-orange">help you?</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10">
              Search our knowledge base to find answers to frequently asked
              questions.
            </p>
          </div>
        </section> */}

        {/* FAQ Content */}
        <section className="contain px-6 -mt-12 relative z-20 w-full flex justify-center">
          <div className="max-w-4xl w-full mx-auto">
            <div className="grid grid-cols-1 gap-12">
              {/* Accordion List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary" />
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    No FAQs found.
                  </p>
                ) : (
                  filteredQuestions.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                      <div
                        key={item.id}
                        className={`group rounded-2xl border transition-all duration-300 ${
                          isOpen
                            ? "border-brand-orange bg-brand-orange/2 shadow-md"
                            : "border-border bg-card hover:border-brand-orange/50"
                        }`}
                      >
                        <button
                          onClick={() => toggleAccordion(idx)}
                          className="cursor-pointer w-full flex items-center justify-between p-6 text-left"
                        >
                          <span
                            className={`text-lg font-semibold transition-colors ${
                              isOpen ? "text-brand-orange" : "text-foreground"
                            }`}
                          >
                            {item.question}
                          </span>
                          <div
                            className={`shrink-0 ml-4 p-1 rounded-full transition-all duration-300 ${
                              isOpen
                                ? "bg-brand-orange text-white rotate-180"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                          </div>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <RenderFormattedText
                            text={item.answer}
                          ></RenderFormattedText>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Support Cards - Centered Below */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <div className="p-8 rounded-3xl bg-brand-orange text-white shadow-2xl shadow-brand-orange/20">
                  <MessageCircle className="mb-4 h-10 w-10" />
                  <h3 className="text-2xl font-bold mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-white/80 mb-6">
                    Can't find the answer you're looking for? Please chat with our
                    friendly team.
                  </p>
                  <button className="w-full py-4 bg-white text-brand-orange font-bold rounded-xl hover:bg-opacity-90 transition-all active:scale-95">
                    Get in Touch
                  </button>
                </div>

                <div className="p-8 rounded-3xl border border-border bg-card">
                  <HelpCircle className="mb-4 h-10 w-10 text-brand-orange" />
                  <h3 className="text-xl font-bold mb-2">Documentation</h3>
                  <p className="text-muted-foreground mb-4">
                    Learn more about our platform and investment structures.
                  </p>
                  <a
                    href="#"
                    className="text-brand-orange font-semibold hover:underline"
                  >
                    Read Docs →
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
