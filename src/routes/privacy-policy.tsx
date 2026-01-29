import { createFileRoute } from "@tanstack/react-router";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/privacy-policy")({
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
              <Shield className="w-12 h-12 text-brand-orange" />
              <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
                Privacy Policy<span className="text-brand-orange">.</span>
              </h1>
            </div>
            <p className="text-white/80 mt-4 text-lg max-w-3xl">
              Your privacy and data security are paramount to us. This policy
              explains how we collect, use, protect, and share your information.
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
                  Welcome to NeedHomes Limited ("NeedHomes," "we," "us," or
                  "our"). We are committed to protecting your personal
                  information and respecting your privacy rights.
                </p>
                <p>
                  This Privacy Policy describes how we collect, use, store,
                  share, and protect your personal information when you use our
                  real estate investment platform and related services
                  (collectively, the "Services").
                </p>
                <p>
                  By accessing or using our Services, you agree to the
                  collection and use of information in accordance with this
                  policy. If you do not agree with our policies and practices,
                  please do not use our Services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="py-20 bg-white">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Information We Collect
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Personal Information
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When you create an account, we collect your name, email address, phone number, and government-issued identification for verification purposes. For investment transactions, we also collect banking details and proof of funds documentation.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Usage Data
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We automatically collect information about how you interact with our platform, including IP address, browser type, device information, pages visited, and time spent on our services. This helps us improve user experience and platform security.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Investment Data
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We maintain records of your investment preferences, transaction history, property interests, and communication with our team to provide personalized service and comply with regulatory requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  How We Use Your Information
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Service Delivery
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your personal information enables us to process investments, manage your portfolio, communicate updates, and provide customer support. We use your data to verify your identity and prevent fraudulent activities.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Platform Improvement
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Aggregated and anonymized usage data helps us understand user behavior, optimize our platform features, and develop new investment opportunities that match our users' interests.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Legal Compliance
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We process your data to comply with anti-money laundering (AML) regulations, know-your-customer (KYC) requirements, tax obligations, and other legal mandates governing real estate transactions in Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="py-20 bg-white">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Data Security
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Encryption
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All sensitive data is encrypted both in transit and at rest using industry-standard AES-256 encryption. We employ SSL/TLS protocols for all data transmissions between your device and our servers.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Access Controls
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement strict access controls ensuring only authorized personnel can access your personal information on a need-to-know basis. All access is logged and regularly audited.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Security Monitoring
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform is continuously monitored for security threats. We conduct regular security audits, penetration testing, and vulnerability assessments to maintain the highest security standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-[#333d42]">
                  Your Rights
                  <span className="text-brand-orange">.</span>
                </h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Access and Correction
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access your personal information and request corrections to any inaccurate data. You can update most information directly through your account dashboard.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Data Deletion
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may request deletion of your personal data, subject to legal and regulatory retention requirements. Active investments may require data retention until completion and finalization.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    Marketing Preferences
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can opt out of marketing communications at any time through your account settings or by clicking the unsubscribe link in our emails. This does not affect transactional communications related to your investments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-[#333d42]">
          <div className="contain mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Mail className="w-12 h-12 text-brand-orange mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-medium text-white mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact our Data Protection Officer.
              </p>
              <div className="space-y-2 text-white/90">
                <p className="font-medium">Email: privacy@needhomes.ng</p>
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
