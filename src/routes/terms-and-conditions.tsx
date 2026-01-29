import { createFileRoute } from "@tanstack/react-router";
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/terms-and-conditions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <div className="flex items-center gap-4 mb-4">
              <Scale className="w-12 h-12 text-brand-orange" />
              <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
                Terms & Conditions
                <span className="text-brand-orange">.</span>
              </h1>
            </div>
            <p className="text-white/80 mt-4 text-lg max-w-3xl">
              Please read these terms carefully before using our platform. These
              terms govern your use of NeedHomes services and your investment
              activities.
            </p>
            <p className="text-white/60 mt-4 text-sm">
              Last updated: January 29, 2026
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-serif font-medium text-[#333d42] mb-6">
                Introduction<span className="text-brand-orange">.</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  These Terms and Conditions ("Terms") constitute a legal
                  agreement between you and NeedHomes Limited ("NeedHomes," "we,"
                  "us," or "our"), a company incorporated in Nigeria.
                </p>
                <p>
                  These Terms apply to your use of our real estate investment
                  platform, website, mobile applications, and all related
                  services (collectively, the "Services"). By creating an account
                  or using our Services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms.
                </p>
                <p className="font-medium text-[#333d42]">
                  PLEASE READ THESE TERMS CAREFULLY. THEY CONTAIN IMPORTANT
                  INFORMATION ABOUT YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS,
                  INCLUDING LIMITATIONS ON LIABILITY AND MANDATORY ARBITRATION.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Registration */}
        <section className="py-20 bg-white">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Account Registration
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Eligibility
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You must be at least 18 years old and legally capable of entering into binding contracts to use our Services. By registering, you represent that all information provided is accurate, current, and complete.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Account Security
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized access or security breaches. NeedHomes will not be liable for losses arising from unauthorized use of your account.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Verification
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We require identity verification in compliance with Nigerian KYC regulations. You must provide valid government-issued identification and may be required to submit additional documentation for verification purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Terms */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Investment Terms
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Investment Risk
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All real estate investments carry inherent risks. Property values may fluctuate, projected returns are not guaranteed, and you may lose some or all of your invested capital. You should carefully review all investment materials and seek independent financial advice before making investment decisions.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Investment Process
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Investment commitments are binding once confirmed and payment is received. Minimum investment amounts vary by property type. Payment plans, where available, are subject to specific terms outlined in the investment agreement.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Ownership and Title
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    For co-development and outright purchase, legal title will be transferred upon completion of payment and project milestones. For fractional ownership, your stake is documented through a co-ownership agreement. All properties undergo title verification and legal due diligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fees and Payments */}
        <section className="py-20 bg-white">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Fees and Payments
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Platform Fees
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    NeedHomes charges transaction fees as disclosed in investment documentation. Fees typically range from 2-5% depending on investment type. All fees are clearly itemized before you commit to an investment.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Payment Processing
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use secure third-party payment processors. You authorize us to charge your designated payment method for investments and applicable fees. Payments are processed through escrow accounts managed by licensed trustees.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Refunds
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Investment commitments are generally non-refundable once confirmed. Refunds may be available during designated cooling-off periods or if a project fails to meet minimum subscription levels, as specified in individual investment agreements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liability and Disclaimers */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Liability and Disclaimers
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Platform Availability
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to maintain platform availability but do not guarantee uninterrupted access. The platform may be unavailable due to maintenance, technical issues, or circumstances beyond our control. We are not liable for losses resulting from platform downtime.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Information Accuracy
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    While we strive to provide accurate property and market information, we make no warranties regarding completeness or accuracy. Property valuations are estimates and may differ from actual market values. You should conduct independent verification.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, NeedHomes shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of the platform or investment losses. Our total liability shall not exceed the fees you paid to NeedHomes in the preceding 12 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="py-20 bg-white">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Governing Law
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through arbitration in Lagos, Nigeria, in accordance with the Arbitration and Conciliation Act. You irrevocably submit to the jurisdiction of Nigerian courts for enforcement of arbitral awards.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-[#333d42]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <FileText className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-medium text-white mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                If you have questions or need clarification about these Terms and
                Conditions, please contact our legal team.
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
